import { supabase } from '../lib/supabase';

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract?: string;
  category?: string;
  keywords: string[];
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  file_url?: string;
  published: boolean;
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaperData {
  title: string;
  authors: string[];
  abstract?: string;
  category?: string;
  keywords?: string[];
  pdf_file: File;
  published?: boolean;
}

export interface UpdatePaperData {
  title?: string;
  authors?: string[];
  abstract?: string;
  category?: string;
  keywords?: string[];
  pdf_file?: File;
  published?: boolean;
}

// Upload PDF to Supabase Storage
async function uploadPaperFile(file: File, paperId: string): Promise<{ url: string; path: string }> {
  console.log('📄 uploadPaperFile called with:', { fileName: file.name, fileSize: file.size, paperId });
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${paperId}-${Date.now()}.${fileExt}`;
  const filePath = `papers/${fileName}`;
  
  console.log('📄 Uploading to path:', filePath);

  const { data, error } = await supabase.storage
    .from('Research Papers')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('❌ Storage upload error:', error);
    throw new Error(`Failed to upload paper: ${error.message}`);
  }

  console.log('✅ Storage upload successful:', data);

  const { data: { publicUrl } } = supabase.storage
    .from('Research Papers')
    .getPublicUrl(filePath);

  console.log('🔗 Generated public URL:', publicUrl);

  return {
    url: publicUrl,
    path: filePath
  };
}

// Get all published papers
export async function getPublishedPapers(): Promise<Paper[]> {
  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch papers: ${error.message}`);
  }

  return data || [];
}

// Get all papers (admin only)
export async function getAllPapers(): Promise<Paper[]> {
  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch papers: ${error.message}`);
  }

  return data || [];
}

// Get papers by category
export async function getPapersByCategory(category: string): Promise<Paper[]> {
  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch papers: ${error.message}`);
  }

  return data || [];
}

// Get paper by ID
export async function getPaper(id: string): Promise<Paper | null> {
  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No rows returned
    }
    throw new Error(`Failed to fetch paper: ${error.message}`);
  }

  return data;
}

// Create new paper
export async function createPaper(paperData: CreatePaperData): Promise<Paper> {
  console.log('🔍 createPaper called with data:', paperData);
  
  let user;
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    console.log('🔍 Auth check result:', { user: authUser?.email, error: authError });
    
    if (!authUser) {
      console.error('❌ No user found in createPaper');
      throw new Error('User must be authenticated to create papers');
    }
    
    user = authUser;
    console.log('✅ User authenticated:', user.email);
  } catch (authError) {
    console.error('❌ Authentication error:', authError);
    throw new Error('Authentication failed. Please try logging in again.');
  }

  // Prepare paper data
  const paperInsertData = {
    title: paperData.title,
    authors: paperData.authors,
    abstract: paperData.abstract || null,
    category: paperData.category || null,
    keywords: paperData.keywords || [],
    published: paperData.published !== undefined ? paperData.published : true,
    author_id: user.id,
    file_name: paperData.pdf_file.name,
    file_size: paperData.pdf_file.size,
    mime_type: paperData.pdf_file.type,
    file_path: '', // Will be updated after upload
    file_url: '' // Will be updated after upload
  };

  // Insert paper
  const { data: paper, error: insertError } = await supabase
    .from('papers')
    .insert(paperInsertData)
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to create paper: ${insertError.message}`);
  }

  // Upload PDF file
  console.log('📄 Starting PDF upload for paper:', paper.id);
  try {
    const fileData = await uploadPaperFile(paperData.pdf_file, paper.id);
    console.log('✅ PDF uploaded successfully:', fileData);
    
    // Update paper with file data
    const { data: updatedPaper, error: updateError } = await supabase
      .from('papers')
      .update({
        file_path: fileData.path,
        file_url: fileData.url
      })
      .eq('id', paper.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Failed to update paper with file data:', updateError);
      return paper;
    }

    console.log('✅ Paper updated with file data:', updatedPaper);
    return updatedPaper;
  } catch (fileError) {
    console.error('❌ Failed to upload PDF:', fileError);
    return paper;
  }
}

// Update paper
export async function updatePaper(id: string, paperData: UpdatePaperData): Promise<Paper> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to update papers');
  }

  // Check if user is the author
  const { data: existingPaper } = await supabase
    .from('papers')
    .select('author_id')
    .eq('id', id)
    .single();

  if (!existingPaper) {
    throw new Error('Paper not found');
  }

  if (existingPaper.author_id !== user.id) {
    throw new Error('You can only update your own papers');
  }

  // Prepare update data
  const updateData: Partial<Omit<Paper, 'id' | 'created_at' | 'updated_at'>> = {};
  if (paperData.title !== undefined) updateData.title = paperData.title;
  if (paperData.authors !== undefined) updateData.authors = paperData.authors;
  if (paperData.abstract !== undefined) updateData.abstract = paperData.abstract;
  if (paperData.category !== undefined) updateData.category = paperData.category;
  if (paperData.keywords !== undefined) updateData.keywords = paperData.keywords;
  if (paperData.published !== undefined) updateData.published = paperData.published;

  // Update paper
  const { data: paper, error: updateError } = await supabase
    .from('papers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update paper: ${updateError.message}`);
  }

  // Upload new PDF if provided
  if (paperData.pdf_file) {
    try {
      const fileData = await uploadPaperFile(paperData.pdf_file, paper.id);
      
      // Update paper with new file data
      const { data: updatedPaper, error: fileUpdateError } = await supabase
        .from('papers')
        .update({
          file_path: fileData.path,
          file_url: fileData.url,
          file_name: paperData.pdf_file.name,
          file_size: paperData.pdf_file.size,
          mime_type: paperData.pdf_file.type
        })
        .eq('id', paper.id)
        .select()
        .single();

      if (fileUpdateError) {
        console.error('Failed to update paper with file:', fileUpdateError);
        return paper;
      }

      return updatedPaper;
    } catch (fileError) {
      console.error('Failed to upload PDF:', fileError);
      return paper;
    }
  }

  return paper;
}

// Delete paper
export async function deletePaper(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to delete papers');
  }

  // Check if user is the author
  const { data: existingPaper } = await supabase
    .from('papers')
    .select('author_id, file_path')
    .eq('id', id)
    .single();

  if (!existingPaper) {
    throw new Error('Paper not found');
  }

  if (existingPaper.author_id !== user.id) {
    throw new Error('You can only delete your own papers');
  }

  // Delete file from storage if it exists
  if (existingPaper.file_path) {
    try {
      await supabase.storage
        .from('Research Papers')
        .remove([existingPaper.file_path]);
    } catch (fileError) {
      console.error('Failed to delete file from storage:', fileError);
    }
  }

  // Delete paper
  const { error } = await supabase
    .from('papers')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete paper: ${error.message}`);
  }
}

// Get paper download URL
export async function getPaperDownloadUrl(paperId: string): Promise<string | null> {
  const paper = await getPaper(paperId);
  if (!paper || !paper.file_url) {
    return null;
  }
  return paper.file_url;
}

// Search papers by keywords
export async function searchPapers(query: string): Promise<Paper[]> {
  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .eq('published', true)
    .or(`title.ilike.%${query}%,abstract.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to search papers: ${error.message}`);
  }

  return data || [];
}

// Get unique categories
export async function getPaperCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('papers')
    .select('category')
    .eq('published', true)
    .not('category', 'is', null);

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const categories = [...new Set(data?.map(p => p.category).filter(Boolean))];
  return categories.sort();
}
