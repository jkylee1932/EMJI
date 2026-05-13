import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  GraduationCap,
  Loader2,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEducatorCourses } from '@/hooks/useCourse';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface CreateCourseForm {
  title: string;
  description: string;
  category: string;
  level: string;
  price_type: string;
  duration: string;
}

const EducatorDashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { courses, loading: coursesLoading, refetch } = useEducatorCourses(user?.id);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CreateCourseForm>({
    title: '', description: '', category: '', level: 'Beginner', price_type: 'free', duration: '',
  });
  const handleAutoSummarize = () => {
  if (!form.description) {
    toast({ title: "Error", description: "Please enter a description first!" });
    return;
  }
  
  // Basic logic to simulate AI summarization
  const sentences = form.description.split('.');
  const summary = sentences.length > 1 
    ? sentences[0] + ". " + sentences[1] + "." 
    : form.description;

  setForm({ ...form, description: summary });
  toast({ title: "Success", description: "Module summarized!" });
};
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  const totalStudents = courses.reduce((sum, c) => sum + (c.students_count || 0), 0);
  const avgRating = courses.length
    ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
    : '—';

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      toast({ title: 'Title and category are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('courses').insert({
        ...form,
        instructor_id: user!.id,
        status: 'draft',
        thumbnail_color: 'gradient-hero',
      });
      if (error) throw error;
      toast({ title: 'Course created!', description: 'Your course has been saved as a draft.' });
      setShowCreate(false);
      setForm({ title: '', description: '', category: '', level: 'Beginner', price_type: 'free', duration: '' });
      refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not create course';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (courseId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from('courses').update({ status: newStatus }).eq('id', courseId);
    if (!error) {
      toast({ title: newStatus === 'published' ? 'Course published!' : 'Course unpublished' });
      refetch();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <GraduationCap className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Educator Dashboard
              </h1>
              <p className="text-white/90">Welcome, {profile?.full_name}!</p>
            </div>
            <Button
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{coursesLoading ? '—' : courses.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {courses.filter(c => c.status === 'published').length} published
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalStudents}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rating</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{avgRating}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-1">
        <div className="container">
          {/* Create Course Form */}
          {showCreate && (
            <Card className="shadow-elevated mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Create New Course</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowCreate(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="course-title">Course Title *</Label>
                    <Input id="course-title" placeholder="e.g., Web Development Fundamentals" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="course-desc">Description</Label>
                    <Textarea id="course-desc" placeholder="What will students learn?" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course-cat">Category *</Label>
                    <Input id="course-cat" placeholder="e.g., Programming, Design, Business" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Level</Label>
                    <Select value={form.level} onValueChange={v => setForm(f => ({ ...f, level: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price Type</Label>
                    <Select value={form.price_type} onValueChange={v => setForm(f => ({ ...f, price_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g., 10 hours" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                  </div>
                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save as Draft'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="courses" className="space-y-8">
            <TabsList>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Your Courses</h2>
                <Button onClick={() => setShowCreate(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </div>

              {coursesLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1,2].map(i => (
                    <Card key={i} className="shadow-soft">
                      <CardHeader><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-1/3 mt-2" /></CardHeader>
                    </Card>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <Card className="shadow-soft">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first course and start teaching!</p>
                    <Button onClick={() => setShowCreate(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Course
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {courses.map((course) => (
                    <Card key={course.id} className="shadow-soft hover:shadow-elevated transition-all duration-300">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <CardTitle>{course.title}</CardTitle>
                              <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                                {course.status}
                              </Badge>
                              <Badge variant="outline" className="capitalize">{course.price_type}</Badge>
                            </div>
                            <CardDescription className="line-clamp-1">{course.description || 'No description yet'}</CardDescription>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" size="sm" onClick={() => handlePublish(course.id, course.status)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {course.status === 'published' ? 'Unpublish' : 'Publish'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Link to={`/course/${course.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <div className="text-2xl font-bold text-foreground">{course.students_count || 0}</div>
                            <div className="text-sm text-muted-foreground">Students</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">{course.rating ? course.rating.toFixed(1) : '—'}</div>
                            <div className="text-sm text-muted-foreground">Rating</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground capitalize">{course.level}</div>
                            <div className="text-sm text-muted-foreground">Level</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">{course.duration || '—'}</div>
                            <div className="text-sm text-muted-foreground">Duration</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Educator Profile</CardTitle>
                  <CardDescription>Your public instructor information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{profile?.full_name}</h3>
                      <p className="text-muted-foreground">{profile?.professional_title || 'Educator'}</p>
                      <Badge variant="outline" className="mt-1 capitalize">{profile?.role}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{courses.filter(c => c.status === 'published').length}</div>
                      <div className="text-sm text-muted-foreground">Published Courses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{totalStudents}</div>
                      <div className="text-sm text-muted-foreground">Total Students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EducatorDashboard;
