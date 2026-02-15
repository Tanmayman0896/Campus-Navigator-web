"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, Clock, Star, Trophy, Play, Lock, Loader2 } from "lucide-react"
import apiService from "@/lib/api"

// Fallback data for when backend is not available
const fallbackModules = [
  {
    id: 1,
    title: "Library Navigation 101",
    description: "Master the art of finding books, study spaces, and research resources",
    duration: "15 min",
    difficulty: "Beginner",
    xp_reward: 100,
    completed: true,
    locked: false,
    progress: 100,
    badge_name: "Library Explorer",
  },
  {
    id: 2,
    title: "Dining Hall Etiquette",
    description: "Learn meal plan basics, dining hours, and social customs",
    duration: "10 min",
    difficulty: "Beginner",
    xp_reward: 75,
    completed: true,
    locked: false,
    progress: 100,
    badge_name: "Foodie",
  },
  {
    id: 3,
    title: "Lab Safety & Equipment",
    description: "Essential safety protocols and equipment usage in campus labs",
    duration: "20 min",
    difficulty: "Intermediate",
    xp_reward: 150,
    completed: false,
    locked: false,
    progress: 60,
    badge_name: "Safety First",
  },
  {
    id: 4,
    title: "Exam Registration System",
    description: "Navigate the online portal for exam scheduling and requirements",
    duration: "12 min",
    difficulty: "Intermediate",
    xp_reward: 125,
    completed: false,
    locked: false,
    progress: 0,
    badge_name: "Test Master",
  },
  {
    id: 5,
    title: "Advanced Research Methods",
    description: "Deep dive into academic research tools and methodologies",
    duration: "30 min",
    difficulty: "Advanced",
    xp_reward: 200,
    completed: false,
    locked: true,
    progress: 0,
    badge_name: "Research Pro",
  },
]

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export default function LearningModules({ userProgress, setUserProgress }: { userProgress: any, setUserProgress: any }) {
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [modules, setModules] = useState(fallbackModules)
  const [loading, setLoading] = useState(false)

  // Load modules from API
  useEffect(() => {
    const loadModules = async () => {
      setLoading(true)
      try {
        const response = await apiService.getLearningModules() as any
        if (response.success && response.modules) {
          setModules(response.modules)
        }
      } catch (error) {
        console.warn('Failed to load modules from API, using fallback data:', error)
        // Keep using fallback data
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [])

  const startModule = (module) => {
    if (module.locked) return
    setSelectedModule(module)
  }

  const completeModule = async (moduleId) => {
    const module = modules.find((m) => m.id === moduleId)
    if (!module || module.completed) return

    try {
      // Try to call API, but continue regardless
      try {
        await apiService.completeModule(moduleId.toString())
      } catch (apiError) {
        console.warn('Failed to update module completion via API:', apiError)
      }

      // Update local state
      const updatedModules = modules.map(m => 
        m.id === moduleId 
          ? { ...m, completed: true, progress: 100 }
          : m
      )
      setModules(updatedModules)

      // Update user progress
      setUserProgress((prev: { xp: number; completedModules: number; badges: number }) => ({
        ...prev,
        xp: prev.xp + (module.xp_reward || 0),
        completedModules: prev.completedModules + 1,
        badges: prev.badges + 1,
      }))
    } catch (error) {
      console.error('Error completing module:', error)
    }
    
    setSelectedModule(null)
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Modern Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            Structured Learning Modules
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            Interactive micro-lessons designed to help you master campus life step by step
          </CardDescription>
        </CardHeader>

        {/* Progress Overview */}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {modules.filter(m => m.completed).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {modules.reduce((total, m) => total + (m.completed ? m.xp_reward : 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {modules.filter(m => m.completed).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-3 text-foreground">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            Your Learning Path
          </h3>

          {modules.map((module, index) => (
            <Card
              key={module.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-xl border border-white/20 ${
                module.locked ? "opacity-60" : ""
              } ${selectedModule?.id === module.id ? "ring-2 ring-purple-500 shadow-2xl scale-[1.02]" : ""}`}
              onClick={() => startModule(module)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-foreground group-hover:text-purple-600 transition-colors">
                        {module.title}
                      </h4>
                      {module.completed && (
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {module.locked && (
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{module.description}</p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-700 font-medium">{module.duration}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${difficultyColors[module.difficulty as keyof typeof difficultyColors]} border-0 font-medium`}
                      >
                        {module.difficulty}
                      </Badge>
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                        <Trophy className="w-3 h-3 text-yellow-600" />
                        <span className="text-yellow-700 font-medium">{module.xp_reward} XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    {module.completed ? (
                      <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white border-0 px-4 py-2">
                        ✓ Completed
                      </Badge>
                    ) : module.locked ? (
                      <Badge variant="outline" className="bg-gray-50 border-gray-200 px-4 py-2">
                        🔒 Locked
                      </Badge>
                    ) : (
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white px-6 py-2 group-hover:scale-105 transition-all duration-300">
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>

                {!module.completed && !module.locked && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">Progress</span>
                      <span className="font-bold text-purple-600">{module.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={module.progress} className="h-3 bg-gray-200" />
                      <div 
                        className="absolute top-0 left-0 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Module Detail/Quiz Panel */}
        <div className="space-y-4">
          {selectedModule ? (
            <Card className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-xl border border-white/20 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-foreground">
                    {selectedModule.title}
                  </CardTitle>
                  <Badge className={`${difficultyColors[selectedModule.difficulty as keyof typeof difficultyColors]} border-0 px-3 py-1`}>
                    {selectedModule.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-base mt-2">
                  {selectedModule.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 p-6 rounded-2xl">
                  <h4 className="font-bold text-lg mb-3 text-foreground">Quick Check: Library Resources</h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Which of the following is the best way to reserve a study room?
                  </p>

                  <div className="space-y-3">
                    {["Online booking system", "Walk-in only", "Email librarian", "Phone call"].map((option, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="w-full justify-start text-left h-12 bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 hover:border-purple-300 transition-all duration-300"
                        onClick={() => completeModule(selectedModule.id)}
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 flex items-center justify-center text-white text-sm font-bold">
                          {String.fromCharCode(65 + i)}
                        </div>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/20">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Earn {selectedModule?.xp_reward || selectedModule?.xp || 0} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Unlock "{selectedModule?.badge_name || selectedModule?.badge || 'Achievement'}" badge</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => completeModule(selectedModule.id)}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 text-white px-8 py-2"
                  >
                    Complete Module
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl border border-white/20 shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Select a Module</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Choose a learning module from the left to start your interactive lesson and earn XP
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
