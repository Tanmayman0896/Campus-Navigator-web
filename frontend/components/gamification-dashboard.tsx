"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Target, Award, BookOpen, Users, MapPin } from "lucide-react"

const badges = [
  {
    id: 1,
    name: "First Steps",
    description: "Completed your first module",
    icon: "🚀",
    earned: true,
    rarity: "common",
  },
  {
    id: 2,
    name: "Library Explorer",
    description: "Mastered library navigation",
    icon: "📚",
    earned: true,
    rarity: "common",
  },
  {
    id: 3,
    name: "Social Butterfly",
    description: "Connected with 5 mentors",
    icon: "🦋",
    earned: true,
    rarity: "uncommon",
  },
  { id: 4, name: "Quiz Master", description: "Scored 100% on 3 quizzes", icon: "🧠", earned: true, rarity: "rare" },
  {
    id: 5,
    name: "Campus Guru",
    description: "Discovered all hidden locations",
    icon: "🗺️",
    earned: false,
    rarity: "epic",
  },
  {
    id: 6,
    name: "Mentor Helper",
    description: "Helped 10 fellow students",
    icon: "🤝",
    earned: false,
    rarity: "legendary",
  },
]

const achievements = [
  {
    id: 1,
    title: "Learning Streak",
    description: "7 days of continuous learning",
    progress: 70,
    target: 100,
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Community Contributor",
    description: "Share helpful tips with others",
    progress: 40,
    target: 100,
    icon: Users,
  },
  { id: 3, title: "Explorer", description: "Visit all campus locations", progress: 85, target: 100, icon: MapPin },
  {
    id: 4,
    title: "Knowledge Seeker",
    description: "Complete advanced modules",
    progress: 25,
    target: 100,
    icon: Target,
  },
]

const rarityColors = {
  common: "bg-gray-100 text-gray-800 border-gray-200",
  uncommon: "bg-green-100 text-green-800 border-green-200",
  rare: "bg-blue-100 text-blue-800 border-blue-200",
  epic: "bg-purple-100 text-purple-800 border-purple-200",
  legendary: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export default function GameificationDashboard({ userProgress }: { userProgress: any }) {
  const earnedBadges = badges.filter((badge) => badge.earned)
  const availableBadges = badges.filter((badge) => !badge.earned)

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Modern Header */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
              <Trophy className="w-6 h-6" />
            </div>
            Your Achievements
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            Track your progress, earn badges, and unlock new challenges as you master campus life
          </CardDescription>
        </CardHeader>

        {/* Achievement Overview */}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{userProgress.completedModules}</div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{userProgress.badges}</div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{userProgress.xp}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">Level {userProgress.level}</div>
              <div className="text-sm text-muted-foreground">Current</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Progress */}
          <Card className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Level Progress</span>
                </div>
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 text-lg px-4 py-2">
                  Level {userProgress.level}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="font-medium text-foreground">Progress to Level {userProgress.level + 1}</span>
                    <span className="font-bold text-purple-600">
                      {userProgress.xp}/{userProgress.nextLevelXp} XP
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={(userProgress.xp / userProgress.nextLevelXp) * 100} className="h-4 bg-gray-200" />
                    <div 
                      className="absolute top-0 left-0 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 animate-pulse"
                      style={{ width: `${(userProgress.xp / userProgress.nextLevelXp) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{userProgress.completedModules}</div>
                    <div className="text-sm text-blue-700 font-medium">Modules Completed</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{userProgress.badges}</div>
                    <div className="text-sm text-purple-700 font-medium">Badges Earned</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                    <div className="text-3xl font-bold text-green-600 mb-1">{userProgress.xp}</div>
                    <div className="text-sm text-green-700 font-medium">Total XP</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Achievements */}
          <Card className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon
                  return (
                    <div 
                      key={achievement.id} 
                      className="p-6 bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-sm border border-white/30 rounded-2xl hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2 text-foreground">{achievement.title}</h4>
                          <p className="text-muted-foreground mb-4 leading-relaxed">{achievement.description}</p>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">Progress</span>
                              <span className="font-bold text-purple-600">
                                {achievement.progress}/{achievement.target}
                              </span>
                            </div>
                            <div className="relative">
                              <Progress value={achievement.progress} className="h-3 bg-gray-200" />
                              <div 
                                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Collection */}
        <div className="space-y-6">
          {/* Earned Badges */}
          <Card className="bg-gradient-to-br from-white/90 to-yellow-50/90 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                Badge Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Earned ({earnedBadges.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl border-2 ${rarityColors[badge.rarity]} hover:scale-105 transition-all duration-300 cursor-pointer group`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{badge.icon}</div>
                        <div className="text-sm font-bold mb-1">{badge.name}</div>
                        <div className="text-xs opacity-75 leading-relaxed">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Badges */}
          <Card className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                Available ({availableBadges.length})
              </h4>
              <div className="space-y-3">
                {availableBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-muted-foreground mb-1">{badge.name}</div>
                        <div className="text-xs text-muted-foreground/75 leading-relaxed">{badge.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Stats */}
          <Card className="bg-gradient-to-br from-white/90 to-emerald-50/90 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                This Week
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <span className="text-sm font-medium text-foreground">XP Earned</span>
                  <span className="font-bold text-xl text-blue-600">+320</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <span className="text-sm font-medium text-foreground">Modules Completed</span>
                  <span className="font-bold text-xl text-purple-600">4</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <span className="text-sm font-medium text-foreground">Tips Shared</span>
                  <span className="font-bold text-xl text-green-600">2</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <span className="text-sm font-medium text-foreground">Learning Streak</span>
                  <span className="font-bold text-xl text-orange-600 flex items-center gap-1">
                    7 days
                    <span className="text-sm">🔥</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
