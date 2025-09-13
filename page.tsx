"use client"
import Image from "next/image";
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MapPin, 
  BookOpen, 
  Users, 
  Trophy, 
  Calendar, 
  Home, 
  User, 
  Smartphone,
  Zap,
  Target,
  TrendingUp,
  Award,
  Clock,
  ChevronRight
} from "lucide-react"
import CampusMap from "@/components/campus-map"
import LearningModules from "@/components/learning-modules"
import CommunityHub from "@/components/community-hub"
import GameificationDashboard from "@/components/gamification-dashboard"
import backgroundImage from '../public/campus-bg-light.jpg'  // Add this import

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
  const [bgImageError, setBgImageError] = useState(false);

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
    { label: "Current Level", value: userProgress.level, icon: null, color: "text-gray-700" },
    { label: "XP Points", value: userProgress.xp, icon: Zap, color: "text-blue-500" },
    { label: "Day Streak", value: userProgress.streak, icon: Target, color: "text-green-500" },
    { label: "Badges", value: userProgress.badges, icon: Award, color: "text-purple-500" },
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
          <div className="space-y-6 pb-6 text-gray-700 max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-300/10 to-blue-400/10 blur-3xl"></div>
              <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Welcome back!
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Ready to explore campus today?</p>

                {/* Progress Section */}
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Your Journey</h2>
                    <Badge className="bg-gray-800 text-white text-lg px-4 py-1 rounded-full">
                      Level {userProgress.level}
                    </Badge>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{userProgress.xp} XP</span>
                      <span className="text-gray-500">{userProgress.nextLevelXp} XP</span>
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(userProgress.xp / userProgress.nextLevelXp) * 100}%` }}
                      ></div>
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
                <Card key={stat.label} className={`bg-white shadow-md hover:shadow-lg rounded-2xl transition-all duration-300 ${mounted ? 'animate-bounce-in' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-4 text-center">
                    {stat.icon && <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />}
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card 
                    key={action.id} 
                    className={`group relative overflow-hidden bg-white shadow-md hover:shadow-xl rounded-2xl transition-all duration-500 cursor-pointer ${mounted ? 'animate-slide-in-up' : ''}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={action.action}
                  >
                    <CardContent className="p-6">
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                      <div className="relative flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-500">{action.subtitle}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Completed "MUJ Library Navigation 101" module</span>
                    <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Earned "Explorer" badge</span>
                    <span className="text-xs text-gray-500 ml-auto">Yesterday</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Connected with mentor Mahesh</span>
                    <span className="text-xs text-gray-500 ml-auto">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/campus-bg-light.jpg"
          alt="Campus Background"
          fill
          priority
          className="object-cover"
          onError={() => setBgImageError(true)}
          style={{
            opacity: bgImageError ? 0 : 1,
          }}
        />
        {bgImageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200" />
        )}
        {/* Modified overlay with reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-blue-50/40 to-purple-50/40 dark:from-slate-900/70 dark:via-purple-900/10 dark:to-slate-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-center h-28 bg-white/70 backdrop-blur-lg shadow-md border-b border-white/20">
          <Image
            src="/Raahi text.png"
            alt="Raahi Logo"
            width={140}
            height={40}
            className="object-contain select-none"
          />
        </header>

        {/* Main Content */}
        <main className="px-4 pt-6 pb-24">
          {renderContent()}
        </main>

        {/* Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/20 px-4 py-2 shadow-2xl">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 p-3 h-auto rounded-2xl transition-all duration-300 ${
                  activeView === item.id 
                    ? "bg-gray-800 text-white shadow-lg" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setActiveView(item.id)}
              >
                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'animate-bounce' : ''}`} />
                <span className="text-xs font-medium">{item.title}</span>
                {activeView === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

