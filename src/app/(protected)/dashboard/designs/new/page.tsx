'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createDesignSchema, type CreateDesignInput } from '@/lib/validators/design';
import { DIFFICULTY_LEVELS, MATERIALS } from '@/lib/utils/constants';
import {
  isAllowedImageType,
  isAllowedModelFile,
  MAX_IMAGE_SIZE,
  MAX_MODEL_SIZE,
  formatFileSize,
  getFileTypeFromExtension,
} from '@/lib/utils/file-validation';
import { UploadTile, type TileType } from '@/components/upload/UploadTile';
import type { Category, Style } from '@/types';

interface TileFile {
  id: string;
  name: string;
  url?: string;
  size?: number;
  dbType?: string; // the file_type enum value stored in design_files
}

export default function NewDesignPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<(Category & { children?: Category[] })[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(null);

  // Per-tile file state
  const [tileFiles, setTileFiles] = useState<Record<TileType, TileFile | null>>({
    profile: null,
    photo: null,
    model: null,
    scan: null,
    mesh: null,
  });
  const [tileUploading, setTileUploading] = useState<Record<TileType, boolean>>({
    profile: false,
    photo: false,
    model: false,
    scan: false,
    mesh: false,
  });

  const [form, setForm] = useState({
    title: '',
    description: '',
    long_description: '',
    is_free: true,
    price_cents: '',
    material: '',
    difficulty_level: '',
    estimated_build_hours: '',
    dimensions_length: '',
    dimensions_width: '',
    dimensions_height: '',
    dimensions_unit: 'in',
    category_ids: [] as string[],
    style_ids: [] as string[],
    tags: '',
  });

  // Fetch categories and styles
  useEffect(() => {
    async function fetchData() {
      const [catRes, styleRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/styles'),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (styleRes.ok) setStyles(await styleRes.json());
    }
    fetchData();
  }, []);

  function updateField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: [] }));
  }

  function toggleArrayField(field: 'category_ids' | 'style_ids', id: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((v) => v !== id)
        : [...prev[field], id],
    }));
  }

  // ─── Upload handler per tile ───
  async function handleTileUpload(tileType: TileType, file: File) {
    if (!designId) return;
    setGlobalError(null);

    const isImageTile = tileType === 'profile' || tileType === 'photo';

    // Validate
    if (isImageTile) {
      if (!isAllowedImageType(file.type)) {
        setGlobalError(`${file.name}: Only JPEG, PNG, WebP, and AVIF images are allowed.`);
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setGlobalError(`${file.name}: Image must be under ${formatFileSize(MAX_IMAGE_SIZE)}.`);
        return;
      }
    } else {
      if (!isAllowedModelFile(file.name)) {
        setGlobalError(`${file.name}: Only STL, STEP, OBJ, PLY, and Fusion 360 files are allowed.`);
        return;
      }
      if (file.size > MAX_MODEL_SIZE) {
        setGlobalError(`${file.name}: File must be under ${formatFileSize(MAX_MODEL_SIZE)}.`);
        return;
      }
    }

    setTileUploading((prev) => ({ ...prev, [tileType]: true }));

    try {
      const bucket = isImageTile ? 'design-images' : 'design-models';
      const filePath = `${designId}/${tileType}-${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        setGlobalError(`Failed to upload ${file.name}: ${uploadError.message}`);
        return;
      }

      if (isImageTile) {
        const { data: { publicUrl } } = supabase.storage
          .from('design-images')
          .getPublicUrl(filePath);

        // Save to design_images table
        const { data: img } = await supabase
          .from('design_images')
          .insert({
            design_id: designId,
            image_url: publicUrl,
            alt_text: `${tileType === 'profile' ? '2D Profile' : 'Installed Photo'} - ${file.name}`,
            display_order: tileType === 'profile' ? 0 : 1,
          })
          .select()
          .single();

        if (img) {
          setTileFiles((prev) => ({
            ...prev,
            [tileType]: { id: img.id, name: file.name, url: publicUrl, size: file.size },
          }));

          // Set profile image as primary if it's the first image
          if (tileType === 'profile' || !tileFiles.profile) {
            await supabase
              .from('designs')
              .update({ primary_image_url: publicUrl })
              .eq('id', designId);
          }
        }
      } else {
        const fileType = getFileTypeFromExtension(file.name);
        const { data: fileRecord } = await supabase
          .from('design_files')
          .insert({
            design_id: designId,
            file_name: file.name,
            file_path: filePath,
            file_type: fileType,
            file_size_bytes: file.size,
          })
          .select()
          .single();

        if (fileRecord) {
          setTileFiles((prev) => ({
            ...prev,
            [tileType]: { id: fileRecord.id, name: file.name, size: file.size, dbType: fileType },
          }));
        }
      }
    } catch (err) {
      setGlobalError(`Upload failed for ${file.name}. Please try again.`);
    } finally {
      setTileUploading((prev) => ({ ...prev, [tileType]: false }));
    }
  }

  async function handleTileRemove(tileType: TileType) {
    const tf = tileFiles[tileType];
    if (!tf || !designId) return;

    const isImageTile = tileType === 'profile' || tileType === 'photo';
    if (isImageTile) {
      await supabase.from('design_images').delete().eq('id', tf.id);
    } else {
      await supabase.from('design_files').delete().eq('id', tf.id);
    }

    setTileFiles((prev) => ({ ...prev, [tileType]: null }));
  }

  // ─── Save / Publish ───
  async function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    await saveDesign(false);
  }

  async function handlePublish() {
    // Validate that at least one 3D file (model, scan, or mesh) is present
    const has3D = tileFiles.model || tileFiles.scan || tileFiles.mesh;
    if (!has3D) {
      setGlobalError('At least one 3D file (Model, Scan, or Mesh) is required to publish.');
      return;
    }
    await saveDesign(true);
  }

  async function saveDesign(publish: boolean) {
    setGlobalError(null);
    setErrors({});

    const input: any = {
      title: form.title,
      description: form.description || undefined,
      long_description: form.long_description || undefined,
      is_free: form.is_free,
      price_cents: form.is_free ? undefined : parseInt(form.price_cents) || undefined,
      material: form.material || undefined,
      difficulty_level: form.difficulty_level || undefined,
      estimated_build_hours: form.estimated_build_hours ? parseInt(form.estimated_build_hours) : undefined,
      category_ids: form.category_ids,
      style_ids: form.style_ids,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    if (form.dimensions_length || form.dimensions_width || form.dimensions_height) {
      input.dimensions_json = {
        length: form.dimensions_length ? parseFloat(form.dimensions_length) : undefined,
        width: form.dimensions_width ? parseFloat(form.dimensions_width) : undefined,
        height: form.dimensions_height ? parseFloat(form.dimensions_height) : undefined,
        unit: form.dimensions_unit,
      };
    }

    const validated = createDesignSchema.safeParse(input);
    if (!validated.success) {
      setErrors(validated.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }

    setLoading(true);
    if (publish) setPublishing(true);

    try {
      let id = designId;

      if (!id) {
        const res = await fetch('/api/designs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        const data = await res.json();
        if (!res.ok) {
          setGlobalError(data.error || 'Failed to create design');
          return;
        }
        id = data.design.id;
        setDesignId(id);
      } else {
        const res = await fetch(`/api/designs/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!res.ok) {
          const data = await res.json();
          setGlobalError(data.error || 'Failed to update design');
          return;
        }
      }

      if (publish && id) {
        const pubRes = await fetch(`/api/designs/${id}/publish`, { method: 'POST' });
        const pubData = await pubRes.json();
        if (!pubRes.ok) {
          setGlobalError(pubData.error || 'Failed to publish');
          return;
        }
        router.push(`/designs/${id}`);
      } else if (!publish && !designId && id) {
        // Just saved draft for the first time — stay on page to allow file uploads
        // designId is now set via setDesignId above
      } else {
        router.push('/dashboard/designs');
      }
    } catch {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setPublishing(false);
    }
  }

  // Check if we have at least one 3D file
  const has3DFile = !!(tileFiles.model || tileFiles.scan || tileFiles.mesh);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Upload a New Design</h1>
      <p className="text-sm text-gray-500 mb-6">
        Share your millwork profile with the community. Upload images and 3D files to help others bring your design to life.
      </p>

      {globalError && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{globalError}</div>
      )}

      <form onSubmit={handleSaveDraft} className="space-y-8">
        {/* Basic Info */}
        <section className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="input-field"
                placeholder="e.g. Victorian Crown Molding Profile"
              />
              {errors.title?.map((err) => <p key={err} className="text-red-600 text-xs mt-1">{err}</p>)}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                id="description"
                rows={2}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="input-field"
                placeholder="Brief overview of this design"
              />
            </div>

            <div>
              <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description
              </label>
              <textarea
                id="long_description"
                rows={5}
                value={form.long_description}
                onChange={(e) => updateField('long_description', e.target.value)}
                className="input-field"
                placeholder="Detailed description, CNC instructions, material recommendations, etc."
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Categories <span className="text-red-500">*</span>
          </h2>
          {errors.category_ids?.map((err) => <p key={err} className="text-red-600 text-xs mb-2">{err}</p>)}
          <div className="space-y-4">
            {categories.map((parent) => (
              <div key={parent.id}>
                <p className="text-sm font-medium text-gray-700 mb-2">{parent.name}</p>
                <div className="flex flex-wrap gap-2">
                  {parent.children?.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => toggleArrayField('category_ids', child.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        form.category_ids.includes(child.id)
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
                      }`}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Styles */}
        <section className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Architectural Style</h2>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleArrayField('style_ids', style.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  form.style_ids.includes(style.id)
                    ? 'bg-wood-800 text-white border-wood-800'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-wood-400'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </section>

        {/* Dimensions & Details */}
        <section className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <select
                value={form.material}
                onChange={(e) => updateField('material', e.target.value)}
                className="input-field"
              >
                <option value="">Select material...</option>
                {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={form.difficulty_level}
                onChange={(e) => updateField('difficulty_level', e.target.value)}
                className="input-field"
              >
                <option value="">Select difficulty...</option>
                {DIFFICULTY_LEVELS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label} — {d.description}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Est. Build Hours</label>
              <input
                type="number"
                min="1"
                value={form.estimated_build_hours}
                onChange={(e) => updateField('estimated_build_hours', e.target.value)}
                className="input-field"
                placeholder="e.g. 4"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
            <div className="grid grid-cols-4 gap-3">
              <input
                type="number"
                step="0.01"
                placeholder="Length"
                value={form.dimensions_length}
                onChange={(e) => updateField('dimensions_length', e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Width"
                value={form.dimensions_width}
                onChange={(e) => updateField('dimensions_width', e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Height"
                value={form.dimensions_height}
                onChange={(e) => updateField('dimensions_height', e.target.value)}
                className="input-field"
              />
              <select
                value={form.dimensions_unit}
                onChange={(e) => updateField('dimensions_unit', e.target.value)}
                className="input-field"
              >
                <option value="in">inches</option>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              className="input-field"
              placeholder="e.g. ornate, ceiling, victorian (comma separated)"
            />
          </div>
        </section>

        {/* Pricing */}
        <section className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={form.is_free}
                onChange={() => updateField('is_free', true)}
                className="text-brand-600"
              />
              <span className="text-sm font-medium">Free</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!form.is_free}
                onChange={() => updateField('is_free', false)}
                className="text-brand-600"
              />
              <span className="text-sm font-medium">Paid</span>
            </label>
          </div>
          {!form.is_free && (
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (cents)</label>
              <input
                type="number"
                min="100"
                step="1"
                value={form.price_cents}
                onChange={(e) => updateField('price_cents', e.target.value)}
                className="input-field"
                placeholder="e.g. 999 for $9.99"
              />
              <p className="text-xs text-gray-400 mt-1">
                Paid downloads are coming soon. Set your price now and it will be activated when the marketplace launches.
              </p>
            </div>
          )}
        </section>

        {/* ─── File Upload Tiles ─── */}
        {designId ? (
          <section className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Design Files</h2>
            <p className="text-sm text-gray-500 mb-2">
              Upload your millwork files. At least one 3D file (model, scan, or mesh) is required to publish.
            </p>
            {!has3DFile && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                You need at least one 3D file (STEP, STL, OBJ, F3D, F3Z, or PLY) to publish this design.
              </p>
            )}

            {/* 5-tile grid: 3 on top, 2 on bottom centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Row 1: Images + primary 3D model */}
              <UploadTile
                type="profile"
                file={tileFiles.profile ?? undefined}
                accept="image/jpeg,image/png,image/webp,image/avif"
                maxSize={MAX_IMAGE_SIZE}
                uploading={tileUploading.profile}
                onFileSelect={(f) => handleTileUpload('profile', f)}
                onRemove={tileFiles.profile ? () => handleTileRemove('profile') : undefined}
              />
              <UploadTile
                type="photo"
                file={tileFiles.photo ?? undefined}
                accept="image/jpeg,image/png,image/webp,image/avif"
                maxSize={MAX_IMAGE_SIZE}
                uploading={tileUploading.photo}
                onFileSelect={(f) => handleTileUpload('photo', f)}
                onRemove={tileFiles.photo ? () => handleTileRemove('photo') : undefined}
              />
              <UploadTile
                type="model"
                file={tileFiles.model ?? undefined}
                accept=".step,.stp,.stl,.obj,.f3d,.f3z"
                required={!has3DFile}
                maxSize={MAX_MODEL_SIZE}
                uploading={tileUploading.model}
                onFileSelect={(f) => handleTileUpload('model', f)}
                onRemove={tileFiles.model ? () => handleTileRemove('model') : undefined}
              />
              {/* Row 2: Scan + Mesh */}
              <UploadTile
                type="scan"
                file={tileFiles.scan ?? undefined}
                accept=".stl,.obj,.ply"
                required={!has3DFile}
                maxSize={MAX_MODEL_SIZE}
                uploading={tileUploading.scan}
                onFileSelect={(f) => handleTileUpload('scan', f)}
                onRemove={tileFiles.scan ? () => handleTileRemove('scan') : undefined}
              />
              <UploadTile
                type="mesh"
                file={tileFiles.mesh ?? undefined}
                accept=".stl,.obj"
                required={!has3DFile}
                maxSize={MAX_MODEL_SIZE}
                uploading={tileUploading.mesh}
                onFileSelect={(f) => handleTileUpload('mesh', f)}
                onRemove={tileFiles.mesh ? () => handleTileRemove('mesh') : undefined}
              />
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Images: JPEG, PNG, WebP (max 10 MB) · 3D files: STEP, STL, OBJ, PLY, Fusion 360 (max 50 MB)
            </p>
          </section>
        ) : (
          <section className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Design Files</h2>
            <p className="text-sm text-gray-500">
              Save as draft first, then you&apos;ll be able to upload your 2D profiles, photos, 3D models, scans, and mesh files.
            </p>
            {/* Preview the tile layout in disabled state */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 opacity-40 pointer-events-none">
              <UploadTile type="profile" accept="" onFileSelect={() => {}} />
              <UploadTile type="photo" accept="" onFileSelect={() => {}} />
              <UploadTile type="model" accept="" required onFileSelect={() => {}} />
              <UploadTile type="scan" accept="" required onFileSelect={() => {}} />
              <UploadTile type="mesh" accept="" required onFileSelect={() => {}} />
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="btn-secondary"
          >
            {loading && !publishing ? 'Saving...' : designId ? 'Save Draft' : 'Create Draft'}
          </button>
          {designId && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading || !has3DFile}
              className={`btn-primary ${!has3DFile ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {publishing ? 'Publishing...' : 'Publish Design'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
