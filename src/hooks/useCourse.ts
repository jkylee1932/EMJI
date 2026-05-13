import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price_type: string;
  instructor_id: string;
  status: string;
  thumbnail_color: string;
  rating: number;
  students_count: number;
  duration: string;
  created_at: string;
  instructor?: { full_name: string; professional_title: string };
}

export const useCourses = (filters?: { category?: string; price_type?: string }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      let query = supabase
        .from('courses')
        .select('*, instructor:profiles(full_name, professional_title)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (filters?.category && filters.category !== 'all') {
        query = query.ilike('category', filters.category);
      }
      if (filters?.price_type) {
        query = query.eq('price_type', filters.price_type);
      }

      const { data, error } = await query;
      if (!error && data) {
        setCourses(data as Course[]);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [filters?.category, filters?.price_type]);

  return { courses, loading };
};

export const useEducatorCourses = (instructorId: string | undefined) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!instructorId) { setLoading(false); return; }

    const fetchCourses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', instructorId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setCourses(data as Course[]);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [instructorId]);

  const refetch = async () => {
    if (!instructorId) return;
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false });
    if (data) setCourses(data as Course[]);
  };

  return { courses, loading, refetch };
};

export const useEnrollments = (userId: string | undefined) => {
  const [enrollments, setEnrollments] = useState<{ course: Course; enrolled_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const fetchEnrollments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select('enrolled_at, course:courses(*)')
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false });

      if (!error && data) {
        setEnrollments(data as { course: Course; enrolled_at: string }[]);
      }
      setLoading(false);
    };

    fetchEnrollments();
  }, [userId]);

  return { enrollments, loading };
};

export const useBookmarks = (userId: string | undefined) => {
  const [bookmarks, setBookmarks] = useState<{ course: Course; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const fetchBookmarks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('created_at, course:courses(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBookmarks(data as { course: Course; created_at: string }[]);
      }
      setLoading(false);
    };

    fetchBookmarks();
  }, [userId]);

  const removeBookmark = async (courseId: string) => {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId!)
      .eq('course_id', courseId);
    setBookmarks((prev) => prev.filter((b) => b.course.id !== courseId));
  };

  return { bookmarks, loading, removeBookmark };
};
