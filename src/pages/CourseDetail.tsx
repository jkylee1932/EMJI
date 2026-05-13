import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Award,
  CheckCircle,
  Play,
  FileText,
  Lock,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CourseData {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price_type: string;
  duration: string;
  students_count: number;
  rating: number;
  thumbnail_color: string;
  instructor?: { full_name: string; professional_title: string };
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: string;
  is_free: boolean;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      setLoading(true);

      const { data: courseData, error } = await supabase
        .from('courses')
        .select('*, instructor:profiles(full_name, professional_title)')
        .eq('id', id)
        .maybeSingle();

      if (error || !courseData) {
        setLoading(false);
        return;
      }
      setCourse(courseData as CourseData);

      // Fetch modules + lessons
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*, lessons(*)')
        .eq('course_id', id)
        .order('order');

      if (modulesData) {
        const sorted = modulesData.map((m: Module) => ({
          ...m,
          lessons: [...(m.lessons || [])].sort((a: Lesson, b: Lesson) => a.order - b.order),
        }));
        setModules(sorted);
      }

      // Check enrollment
      if (user) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .maybeSingle();
        setIsEnrolled(!!enrollment);
      }

      setLoading(false);
    };

    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast({ title: 'Sign in to enroll', description: 'Create a free account to get started', variant: 'destructive' });
      navigate('/signup');
      return;
    }
    setEnrolling(true);
    try {
      const { error } = await supabase.from('enrollments').insert({
        user_id: user.id,
        course_id: id,
      });
      if (error && error.code !== '23505') throw error;
      setIsEnrolled(true);
      toast({ title: 'Enrolled successfully!', description: 'You can now access this course.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not enroll';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setEnrolling(false);
    }
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <section className="gradient-hero py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Course not found</h2>
            <Link to="/courses"><Button>Browse Courses</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Course Header */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                  {course.level}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {course.title}
              </h1>
              <p className="text-xl text-white/90">{course.description}</p>
              <div className="flex flex-wrap items-center gap-6 text-white">
                {course.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-warning text-warning" />
                    <span className="font-medium">{Number(course.rating).toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.students_count || 0} students</span>
                </div>
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{course.duration}</span>
                  </div>
                )}
                {totalLessons > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{totalLessons} lessons</span>
                  </div>
                )}
              </div>
              {course.instructor && (
                <div className="text-white/90">
                  Created by <span className="font-semibold text-white">{course.instructor.full_name}</span>
                  {course.instructor.professional_title && (
                    <span className="text-white/70"> · {course.instructor.professional_title}</span>
                  )}
                </div>
              )}
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-elevated sticky top-24">
                <CardHeader>
                  <div className={`aspect-video rounded-lg ${course.thumbnail_color || 'gradient-card'} flex items-center justify-center mb-4`}>
                    <Play className="h-16 w-16 text-primary" />
                  </div>
                  <CardTitle className="text-3xl capitalize">
                    {course.price_type === 'free' ? 'Free' : 'Premium'}
                  </CardTitle>
                  <CardDescription>Full lifetime access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEnrolled ? (
                    <Button className="w-full" size="lg" variant="secondary">
                      <CheckCircle className="mr-2 h-5 w-5 text-success" />
                      Enrolled
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enrolling...</>
                      ) : (
                        'Enroll Now'
                      )}
                    </Button>
                  )}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{totalLessons > 0 ? `${totalLessons} lessons` : 'Video lessons'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span>Access on mobile and desktop</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="h-5 w-5 text-success flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 bg-background flex-1">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About this Course</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      <p>{course.description || 'No description available for this course.'}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Curriculum</CardTitle>
                      <CardDescription>
                        {modules.length} modules · {totalLessons} lessons
                        {course.duration && ` · ${course.duration} total`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {modules.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No curriculum added yet.
                        </p>
                      ) : (
                        <Accordion type="single" collapsible className="w-full">
                          {modules.map((module, index) => (
                            <AccordionItem key={module.id} value={`module-${module.id}`}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold">{module.title}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {module.lessons.length} lessons
                                    </div>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="ml-11 space-y-2">
                                  {module.lessons.map((lesson: Lesson) => (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        {lesson.type === 'video' ? (
                                          <Play className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                          <FileText className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="text-sm">{lesson.title}</span>
                                        {lesson.is_free && (
                                          <Badge variant="outline" className="text-xs">Free</Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {lesson.duration && (
                                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                                        )}
                                        {!lesson.is_free && !isEnrolled && <Lock className="h-4 w-4 text-muted-foreground" />}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="instructor" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About the Instructor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {course.instructor ? (
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Users className="h-10 w-10 text-primary" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-foreground">{course.instructor.full_name}</h3>
                            {course.instructor.professional_title && (
                              <p className="text-muted-foreground">{course.instructor.professional_title}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Instructor information not available.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Level</span>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  {course.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="text-sm font-medium">{course.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Modules</span>
                    <span className="text-sm font-medium">{modules.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Students</span>
                    <span className="text-sm font-medium">{course.students_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Certificate</span>
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;
