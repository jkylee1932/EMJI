import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  BookOpen,
  Award,
  Users,
  TrendingUp,
  Video,
  FileText,
  CheckCircle,
  Sparkles,
  Target,
  Shield,
  Clock,
  Star,
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-hero py-20 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Welcome to the Future of Learning
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Empower Your Learning Journey with ModuLearn
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Access structured, high-quality courses from expert educators. Learn at your own pace, track your progress, and achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elevated">
                  Get Started Free
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Browse Courses
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 pt-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-white/80">Active Students</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">200+</div>
                <div className="text-sm text-white/80">Expert Educators</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-white/80">Quality Courses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Why Choose ModuLearn</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive learning platform designed for both students and educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-soft hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Structured Learning</CardTitle>
                <CardDescription>
                  Courses organized into manageable modules for better understanding and retention
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Video Lessons</CardTitle>
                <CardDescription>
                  High-quality video content with notes and downloadable materials
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Interactive Quizzes</CardTitle>
                <CardDescription>
                  Test your knowledge with quizzes and track your performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your learning journey with detailed progress dashboards
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>
                  Earn certificates of completion to showcase your achievements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-elevated transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Expert Educators</CardTitle>
                <CardDescription>
                  Learn from qualified teachers and industry professionals
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline">For Students</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Learn Anytime, Anywhere
              </h2>
              <p className="text-muted-foreground text-lg">
                Access a wide range of courses tailored to your learning needs. From free materials to premium content, we've got you covered.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Course Browsing & Search</div>
                    <div className="text-sm text-muted-foreground">Find courses that match your interests easily</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Free Learning Materials</div>
                    <div className="text-sm text-muted-foreground">Access selected lessons and resources for free</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Progress Tracking</div>
                    <div className="text-sm text-muted-foreground">Monitor your learning journey and achievements</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Premium Benefits</div>
                    <div className="text-sm text-muted-foreground">Full access, downloads, and certificates</div>
                  </div>
                </li>
              </ul>
              <Link to="/signup">
                <Button size="lg" className="shadow-soft">
                  Start Learning Today
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-soft">
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Self-Paced</CardTitle>
                  <CardDescription>Learn at your own speed</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-soft">
                <CardHeader>
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">24/7 Access</CardTitle>
                  <CardDescription>Study anytime you want</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-soft">
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Rich Content</CardTitle>
                  <CardDescription>Videos, notes & quizzes</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-soft">
                <CardHeader>
                  <Star className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Quality</CardTitle>
                  <CardDescription>Expert-curated courses</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* For Educators Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="shadow-elevated gradient-card p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">1000+</div>
                      <div className="text-sm text-muted-foreground">Students Reached</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">Advanced Analytics</div>
                      <div className="text-sm text-muted-foreground">Track student engagement</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">Monetization</div>
                      <div className="text-sm text-muted-foreground">Earn from your expertise</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <Badge variant="outline">For Educators</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Share Your Knowledge, Grow Your Impact
              </h2>
              <p className="text-muted-foreground text-lg">
                Create and manage courses easily. Reach thousands of students and grow your digital presence with our powerful tools.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Easy Course Creation</div>
                    <div className="text-sm text-muted-foreground">Upload lessons, videos, and quizzes effortlessly</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Student Interaction</div>
                    <div className="text-sm text-muted-foreground">Provide feedback and communicate with learners</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Advanced Analytics</div>
                    <div className="text-sm text-muted-foreground">Track student performance and engagement</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">Monetization Tools</div>
                    <div className="text-sm text-muted-foreground">Earn income from your courses</div>
                  </div>
                </li>
              </ul>
              <Link to="/signup">
                <Button size="lg" className="shadow-soft">
                  Start Teaching Today
                  <Users className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of students and educators already using ModuLearn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elevated">
                  Get Started for Free
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
