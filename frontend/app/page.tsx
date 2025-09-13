"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MapPin, 
  BookOpen, 
  Users, 
  Trophy, 
  Star, 
  Calendar, 
  Home, 
  User, 
  Smartphone,
  Zap,
  Target,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  Sparkles
} from "lucide-react"
import CampusMap from "@/components/campus-map"
import LearningModules from "@/components/learning-modules"
import CommunityHub from "@/components/community-hub"
import GameificationDashboard from "@/components/gamification-dashboard"

export default function CampusNavigator() {
  const [activeView, setActiveView] = useState("home")
  const [mounted, setMounted] = useState(false)
  const [userProgress, setUserProgress] = useState({
    level: 2,
    xp: 750,
    nextLevelXp: 1000,
    badges: 12,
    completedModules: 8,
    totalModules: 15,
    streak: 5,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const quickActions = [
    {
      id: "location",
      title: "Explore Campus",
      subtitle: "Interactive map",
      icon: MapPin,
      gradient: "from-blue-500 to-cyan-500",
      action: () => setActiveView("map"),
    },
    {
      id: "learning",
      title: "Continue Learning",
      subtitle: "8/15 modules",
      icon: BookOpen,
      gradient: "from-green-500 to-emerald-500",
      action: () => setActiveView("learn"),
    },
    {
      id: "mentor",
      title: "Find Mentors",
      subtitle: "Connect & grow",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      action: () => setActiveView("community"),
    },
    {
      id: "achievements",
      title: "Achievements",
      subtitle: "12 badges earned",
      icon: Trophy,
      gradient: "from-orange-500 to-red-500",
      action: () => setActiveView("achievements"),
    },
  ]

  const navItems = [
    { id: "home", title: "Home", icon: Home },
    { id: "map", title: "Map", icon: MapPin },
    { id: "learn", title: "Learn", icon: BookOpen },
    { id: "community", title: "Community", icon: Users },
    { id: "profile", title: "Profile", icon: User },
  ]

  const stats = [
    { 
      label: "Current Level", 
      value: userProgress.level, 
      icon: Star,
      color: "text-yellow-500"
    },
    { 
      label: "XP Points", 
      value: userProgress.xp, 
      icon: Zap,
      color: "text-blue-500"
    },
    { 
      label: "Day Streak", 
      value: userProgress.streak, 
      icon: Target,
      color: "text-green-500"
    },
    { 
      label: "Badges", 
      value: userProgress.badges, 
      icon: Award,
      color: "text-purple-500"
    },
  ]

  const renderContent = () => {
    switch (activeView) {
      case "map":
        return <CampusMap />
      case "learn":
        return <LearningModules userProgress={userProgress} setUserProgress={setUserProgress} />
      case "community":
        return <CommunityHub />
      case "achievements":
        return <GameificationDashboard userProgress={userProgress} />
      default:
        return (
          <div className="space-y-6 pb-6">
            {/* Header Section with Glassmorphism */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Good morning! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">Ready to explore campus today?</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Your Journey</h2>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      <Star className="w-4 h-4 mr-1" />
                      Level {userProgress.level}
                    </Badge>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{userProgress.xp} XP</span>
                      <span className="text-muted-foreground">{userProgress.nextLevelXp} XP</span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(userProgress.xp / userProgress.nextLevelXp) * 100}%` }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>

                  {/* Module Progress */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-green-500" />
                      <span className="font-medium">
                        {userProgress.completedModules} of {userProgress.totalModules} modules completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{userProgress.streak} day streak</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={stat.label} className={`bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300 ${mounted ? 'animate-bounce-in' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-4 text-center">
                    <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Quick Actions</h3>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card 
                    key={action.id} 
                    className={`group relative overflow-hidden bg-white/50 backdrop-blur-sm border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer ${mounted ? 'animate-slide-in-up' : ''}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={action.action}
                  >
                    <CardContent className="p-6">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                      
                      {/* Content */}
                      <div className="relative flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                            {action.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Completed "Library Navigation 101" module</span>
                    <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Earned "Explorer" badge</span>
                    <span className="text-xs text-muted-foreground ml-auto">Yesterday</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Connected with mentor Sarah</span>
                    <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Status Bar */}
      <div className="bg-black text-white px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <span>Campus Navigator</span>
        </div>
        <div className="flex items-center gap-2">
          <span>100%</span>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-full h-full bg-green-500 rounded-sm"></div>
          </div>
          <Smartphone className="w-3 h-3" />
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 pt-6 pb-24">
        {renderContent()}
      </main>

      {/* Modern Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20 px-4 py-2 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 p-3 h-auto rounded-2xl transition-all duration-300 ${
                activeView === item.id 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                  : "text-muted-foreground hover:text-purple-600 hover:bg-purple-50"
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <item.icon className={`w-5 h-5 ${activeView === item.id ? 'animate-bounce' : ''}`} />
              <span className="text-xs font-medium">{item.title}</span>
              {activeView === item.id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
              )}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}
