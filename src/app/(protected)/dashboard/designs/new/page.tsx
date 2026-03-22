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
import type { Category, Style } from '@/types';

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
  const [uploadedImages, setUploadedImages] = useState<{ id: string; url: string; name: string }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string; type: string; size: number }[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

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

  async function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    await saveDesign(false);
  }

  async function handlePublish() {
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

    // Build dimensions if any are set
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
        // Create new design
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
        // Update existing
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !designId) return;

    setImageUploading(true);
    for (const file of Array.from(files)) {
      if (!isAllowedImageType(file.type)) {
        setGlobalError(`${file.name}: Only JPEG, PNG, WebP, and AVIF images are allowed.`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setGlobalError(`${file.name}: Image must be under ${formatFileSize(MAX_IMAGE_SIZE)}.`);
        continue;
      }

      const filePath = `${designId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('design-images')
        .upload(filePath, file);

      if (error) {
        setGlobalError(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('design-images')
        .getPublicUrl(filePath);

      // Save to design_images table
      const { data: img } = await supabase
        .from('design_images')
        .insert({
          design_id: designId,
          image_url: publicUrl,
          alt_text: file.name,
          display_order: uploadedImages.length,
        })
        .select()
        .single();

      if (img) {
        setUploadedImages((prev) => [...prev, { id: img.id, url: publicUrl, name: file.name }]);

        // Set first image as primary
        if (uploadedImages.length === 0) {
          await supabase
            .from('designs')
            .update({ primary_image_url: publicUrl })
            .eq('id', designId);
        }
      }
    }
    setImageUploading(false);
    e.target.value = '';
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !designId) return;

    setFileUploading(true);
    for (const file of Array.from(files)) {
      if (!isAllowedModelFile(file.name)) {
        setGlobalError(`${file.name}: Only STL, STEP, OBJ, PLY, and Fusion 360 files are allowed.`);
        continue;
      }
      if (file.size > MAX_MODEL_SIZE) {
        setGlobalError(`${file.name}: File must be under ${formatFileSize(MAX_MODEL_SIZE)}.`);
        continue;
      }

      const filePath = `${designId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('design-models')
        .upload(filePath, file);

      if (error) {
        setGlobalError(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }

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
        setUploadedFiles((prev) => [
          ...prev,
          { id: fileRecord.id, name: file.name, type: fileType, size: file.size },
        ]);
      }
    }
    setFileUploading(false);
    e.target.value = '';
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Upload a New Design</h1>

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

        {/* File uploads — only after initial save */}
        {designId && (
          <>
            <section className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Images</h2>
              <p className="text-sm text-gray-500 mb-4">
                Upload photos of the installed millwork, profile cross-sections, or renders. At least one image is required to publish.
              </p>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <label className="inline-flex items-center gap-2 btn-secondary text-sm cursor-pointer">
                {imageUploading ? 'Uploading...' : 'Add Images'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={imageUploading}
                />
              </label>
            </section>

            <section className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">3D Files</h2>
              <p className="text-sm text-gray-500 mb-4">
                Upload STL, STEP, OBJ, PLY, or Fusion 360 files. Max 50MB per file.
              </p>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mb-4">
                  {uploadedFiles.map((f) => (
                    <div key={f.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm">
                      <span className="font-medium text-gray-700">{f.name}</span>
                      <span className="text-gray-400">{formatFileSize(f.size)} · {f.type.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}

              <label className="inline-flex items-center gap-2 btn-secondary text-sm cursor-pointer">
                {fileUploading ? 'Uploading...' : 'Add 3D Files'}
                <input
                  type="file"
                  accept=".stl,.step,.stp,.obj,.ply,.f3d,.f3z"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={fileUploading}
                />
              </label>
            </section>
          </>
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
              disabled={loading}
              className="btn-primary"
            >
              {publishing ? 'Publishing...' : 'Publish Design'}
            </button>
          )}
        </div>

        {!designId && (
          <p className="text-sm text-gray-500">
            Save as draft first, then you can upload images and 3D files.
          </p>
        )}
      </form>
    </div>
  );
}
