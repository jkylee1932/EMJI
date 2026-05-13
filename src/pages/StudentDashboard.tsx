import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Clock,
  Award,
  BookmarkCheck,
  Play,
  CheckCircle,
  Sparkles,
  GraduationCap,
  Lock,
  LogOut,
  LayoutDashboard,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEnrollments, useBookmarks } from '@/hooks/useCourses';

type Section = 'courses' | 'saved' | 'certificates';

const SidebarNav = ({
  activeSection,
  onSelect,
  profile,
  initials,
  onSignOut,
}: {
  activeSection: Section;
  onSelect: (s: Section) => void;
  profile: { full_name?: string; role?: string; is_premium?: boolean } | null;
  initials: string;
  onSignOut: () => void;
}) => {
  const navItems: { label: string; icon: React.ElementType; section: Section }[] = [
    { label: 'My Courses', icon: BookOpen, section: 'courses' },
    { label: 'Saved', icon: BookmarkCheck, section: 'saved' },
    { label: 'Certificates', icon: Award, section: 'certificates' },
  ];

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-base font-bold text-white">ModuLearn</span>
        </Link>
      </div>

      {/* User profile */}
      <div className="px-4 py-4 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{profile?.full_name || 'Student'}</div>
            <div className="text-xs text-sidebar-foreground capitalize">{profile?.role}</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 mb-2">
          Learning
        </div>
        {navItems.map((item) => (
          <button
            key={item.section}
            onClick={() => onSelect(item.section)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeSection === item.section
                ? 'bg-primary/20 text-primary'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white'
            }`}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
            {activeSection === item.section && (
              <ChevronRight className="h-3 w-3 ml-auto opacity-60" />
            )}
          </button>
        ))}

        <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 mb-2 mt-4">
          Explore
        </div>
        <Link to="/courses">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-all">
            <Search className="h-4 w-4 flex-shrink-0" />
            Browse Courses
          </button>
        </Link>
        <Link to="/">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-all">
            <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
            Home
          </button>
        </Link>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 flex-shrink-0 space-y-2 border-t border-sidebar-border pt-4">
        {!profile?.is_premium && (
          <Link to="/pricing" className="block">
            <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary/20 text-primary hover:bg-primary/30 transition-all">
              <Sparkles className="h-4 w-4" />
              Upgrade to Premium
            </button>
          </Link>
        )}
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  variant = 'default',
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  variant?: 'violet' | 'amber' | 'emerald' | 'default';
}) => {
  const variantStyles = {
    violet: { icon: 'bg-primary/10 text-primary', bar: 'bg-primary' },
    amber: { icon: 'bg-accent/10 text-accent', bar: 'bg-accent' },
    emerald: { icon: 'bg-success/10 text-success', bar: 'bg-success' },
    default: { icon: 'bg-muted text-muted-foreground', bar: 'bg-border' },
  };
  const s = variantStyles[variant];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft group hover:shadow-elevated transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-foreground mb-0.5">{value}</div>
      <div className="text-sm font-semibold text-foreground">{label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      <div className={`absolute bottom-0 left-0 w-full h-0.5 ${s.bar} opacity-60`} />
    </div>
  );
};

const StudentDashboard = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { enrollments, loading: enrollLoading } = useEnrollments(user?.id);
  const { bookmarks, loading: bookmarkLoading, removeBookmark } = useBookmarks(user?.id);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('courses');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? 'U';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <GraduationCap className="h-7 w-7 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (desktop) */}
      <SidebarNav
        activeSection={activeSection}
        onSelect={setActiveSection}
        profile={profile}
        initials={initials}
        onSignOut={handleSignOut}
      />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile navbar */}
        <div className="lg:hidden">
          <Navbar />
        </div>

        {/* Desktop sticky topbar */}
        <header className="hidden lg:flex h-16 items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              {activeSection === 'courses' ? 'My Courses' : activeSection === 'saved' ? 'Saved Courses' : 'Certificates'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/courses">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Browse Courses
              </Button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Greeting */}
          <div className="mb-8 animate-fade-up-1">
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight mb-1">
              Good to see you, {profile?.full_name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-fade-up-2">
            <StatCard
              label="Enrolled"
              value={enrollLoading ? '—' : enrollments.length}
              sub="Active courses"
              icon={BookOpen}
              variant="violet"
            />
            <StatCard
              label="Saved"
              value={bookmarkLoading ? '—' : bookmarks.length}
              sub="Bookmarked"
              icon={BookmarkCheck}
              variant="amber"
            />
            <StatCard
              label={profile?.is_premium ? 'Premium' : 'Free'}
              value={profile?.is_premium ? 'Full' : 'Basic'}
              sub="Account plan"
              icon={Award}
              variant="emerald"
            />
            <StatCard
              label="Hours"
              value="—"
              sub="Tracked time"
              icon={Clock}
              variant="default"
            />
          </div>

          {/* Section Content */}
          <div className="animate-fade-up-3">
            {/* ── My Courses ── */}
            {activeSection === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">Continue Learning</h2>
                  <Link to="/courses">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary text-xs gap-1">
                      Browse all
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>

                {enrollLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
                        <Skeleton className="h-36 w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : enrollments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Link to="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {enrollments.map(({ course, enrolled_at }) => (
                      <div
                        key={course.id}
                        className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-elevated transition-all duration-300"
                      >
                        <div className="h-36 gradient-hero flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 dot-grid opacity-30" />
                          <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <BookOpen className="h-7 w-7 text-white" />
                          </div>
                        </div>
                        <div className="p-5">
                          <Badge variant="secondary" className="mb-2 text-xs">{course.category || 'Course'}</Badge>
                          <h3 className="font-display font-bold text-foreground line-clamp-1 mb-1">{course.title}</h3>
                          <p className="text-xs text-muted-foreground mb-4">
                            Enrolled {new Date(enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium text-foreground">0%</span>
                            </div>
                            <Progress value={0} className="h-1.5" />
                          </div>
                          <Link to={`/course/${course.id}`}>
                            <Button size="sm" className="w-full gap-2 text-xs h-9">
                              <Play className="h-3.5 w-3.5" />
                              Continue Learning
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Saved Courses ── */}
            {activeSection === 'saved' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Saved for Later</h2>

                {bookmarkLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[1, 2].map((i) => (
                      <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3">
                        <Skeleton className="h-36 w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <BookmarkCheck className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">No saved courses</h3>
                    <p className="text-muted-foreground mb-6 text-sm">Bookmark courses to save them for later</p>
                    <Link to="/courses"><Button>Browse Courses</Button></Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {bookmarks.map(({ course }) => (
                      <div
                        key={course.id}
                        className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-elevated transition-all duration-300"
                      >
                        <div className="h-36 gradient-card flex items-center justify-center">
                          <BookmarkCheck className="h-10 w-10 text-primary" />
                        </div>
                        <div className="p-5">
                          <Badge variant="secondary" className="mb-2 text-xs">{course.category || 'Course'}</Badge>
                          <h3 className="font-display font-bold text-foreground line-clamp-1 mb-1">{course.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                          <div className="flex gap-2">
                            <Link to={`/course/${course.id}`} className="flex-1">
                              <Button size="sm" className="w-full text-xs h-9">View Course</Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-9 px-3 text-destructive hover:text-destructive"
                              onClick={() => removeBookmark(course.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Certificates ── */}
            {activeSection === 'certificates' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Certificates</h2>
                <div className="rounded-2xl border border-border bg-card p-10 text-center">
                  {!profile?.is_premium ? (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">Premium Feature</h3>
                      <p className="text-muted-foreground mb-6 text-sm max-w-sm mx-auto">
                        Upgrade to Premium to earn certificates of completion for finished courses
                      </p>
                      <Link to="/pricing">
                        <Button className="gap-2">
                          <Sparkles className="h-4 w-4" />
                          Upgrade to Premium
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-success" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">No certificates yet</h3>
                      <p className="text-muted-foreground mb-6 text-sm">Complete courses to earn your certificates</p>
                      <Link to="/courses"><Button>Browse Courses</Button></Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile footer */}
        <div className="lg:hidden">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
