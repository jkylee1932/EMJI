import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Clock, Users, Star, BookmarkPlus, Filter } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const categories = ['All', 'Programming', 'Design', 'Marketing', 'Data Science', 'Business'];

const CourseCard = ({ course }: { course: ReturnType<typeof useCourses>['courses'][0] }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: 'Sign in to bookmark courses', variant: 'destructive' });
      return;
    }
    const { error } = await supabase
      .from('bookmarks')
      .upsert({ user_id: user.id, course_id: course.id }, { onConflict: 'user_id,course_id' });
    if (!error) toast({ title: 'Course saved to bookmarks!' });
  };

  return (
    <Card className="shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col">
      <CardHeader>
        <div className={`h-40 rounded-lg ${course.thumbnail_color || 'gradient-hero'} mb-4 flex items-center justify-center`}>
          <BookOpen className="h-16 w-16 text-white/80" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{course.category}</Badge>
          <Badge variant={course.price_type === 'free' ? 'outline' : 'default'} className="capitalize">
            {course.price_type}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {course.rating ? (
                <>
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-medium text-foreground">{Number(course.rating).toFixed(1)}</span>
                </>
              ) : (
                <span>No rating yet</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students_count || 0}</span>
            </div>
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            By {course.instructor?.full_name || 'Instructor'}
          </div>
          <Badge variant="outline" className="text-xs">{course.level}</Badge>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Link to={`/course/${course.id}`} className="flex-1">
          <Button className="w-full">View Course</Button>
        </Link>
        <Button variant="outline" size="icon" onClick={handleBookmark}>
          <BookmarkPlus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const CourseGrid = ({ courses, loading }: { courses: ReturnType<typeof useCourses>['courses']; loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <Card key={i} className="shadow-soft">
            <CardHeader>
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4 mt-4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { courses, loading } = useCourses({ category: selectedCategory });

  const filtered = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const free = filtered.filter(c => c.price_type === 'free');
  const premium = filtered.filter(c => c.price_type === 'premium');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Explore Our Courses
            </h1>
            <p className="text-xl text-white/90">
              Discover high-quality courses from expert educators
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for courses..."
                className="pl-12 h-14 text-lg bg-white/95 backdrop-blur"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="container">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Category:</span>
            </div>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat.toLowerCase() ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.toLowerCase())}
                className="flex-shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-12 bg-background flex-1">
        <div className="container">
          <Tabs defaultValue="all" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="all">All Courses ({filtered.length})</TabsTrigger>
                <TabsTrigger value="free">Free ({free.length})</TabsTrigger>
                <TabsTrigger value="premium">Premium ({premium.length})</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <CourseGrid courses={filtered} loading={loading} />
            </TabsContent>
            <TabsContent value="free">
              <CourseGrid courses={free} loading={loading} />
            </TabsContent>
            <TabsContent value="premium">
              <CourseGrid courses={premium} loading={loading} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
