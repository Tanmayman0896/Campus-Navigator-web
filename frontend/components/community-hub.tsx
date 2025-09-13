"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Users, MessageCircle, Heart, Share, Calendar, Zap } from "lucide-react"

const communityPosts = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "/diverse-students-studying.png",
    role: "Senior Mentor",
    time: "2 hours ago",
    content:
      "Pro tip: The library's 3rd floor has the quietest study spots, and they have phone charging stations at every desk! Perfect for long study sessions.",
    likes: 24,
    comments: 8,
    category: "Study Tips",
    helpful: true,
  },
  {
    id: 2,
    author: "Mike Rodriguez",
    avatar: "/mentor.png",
    role: "Peer Mentor",
    time: "4 hours ago",
    content:
      'Hosting a "Campus Navigation 101" session tomorrow at 3 PM in the Student Center. We\'ll cover shortcuts, hidden gems, and answer all your questions!',
    likes: 18,
    comments: 12,
    category: "Events",
    helpful: false,
  },
  {
    id: 3,
    author: "Emma Thompson",
    avatar: "/diverse-students-studying.png",
    role: "Freshman",
    time: "6 hours ago",
    content:
      "Just discovered the 24/7 study lounge in the basement of the engineering building. It's a game-changer for late-night cramming sessions!",
    likes: 31,
    comments: 15,
    category: "Discovery",
    helpful: true,
  },
]

const upcomingSessions = [
  {
    id: 1,
    title: "Lab Safety Workshop",
    mentor: "Dr. Johnson",
    time: "Today, 2:00 PM",
    location: "Chemistry Lab A",
    spots: 3,
  },
  {
    id: 2,
    title: "Study Group Formation",
    mentor: "Alex Kim",
    time: "Tomorrow, 4:00 PM",
    location: "Library Study Room 5",
    spots: 8,
  },
  {
    id: 3,
    title: "Campus Tour for Freshers",
    mentor: "Student Council",
    time: "Friday, 10:00 AM",
    location: "Main Entrance",
    spots: 15,
  },
]

export default function CommunityHub() {
  const [newPost, setNewPost] = useState("")

  const handleLike = (postId: number) => {
    // Handle like functionality
    console.log("Liked post:", postId)
  }

  const joinSession = (sessionId: number) => {
    // Handle session joining
    console.log("Joined session:", sessionId)
  }

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Modern Header */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white">
              <Users className="w-6 h-6" />
            </div>
            Community Hub
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            Connect with mentors, share tips, and join helpful sessions with fellow students
          </CardDescription>
        </CardHeader>

        {/* Community Stats */}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">24</div>
              <div className="text-sm text-muted-foreground">Active Mentors</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-muted-foreground">Community Posts</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">18</div>
              <div className="text-sm text-muted-foreground">Tips Today</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-muted-foreground">Live Sessions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="w-12 h-12 ring-2 ring-white/50">
                  <AvatarImage src="/abstract-geometric-shapes.png" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                    You
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="Share a campus tip, ask a question, or help a fellow student..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-24 bg-white/50 backdrop-blur-sm border-white/30 rounded-xl resize-none text-base"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 border-0 text-white hover:from-yellow-500 hover:to-orange-500">
                        💡 Tip
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-400 to-cyan-400 border-0 text-white hover:from-blue-500 hover:to-cyan-500">
                        ❓ Question
                      </Badge>
                      <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 border-0 text-white hover:from-purple-500 hover:to-pink-500">
                        🎉 Discovery
                      </Badge>
                    </div>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 text-white px-8">
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts */}
          {communityPosts.map((post) => (
            <Card 
              key={post.id} 
              className="group bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-xl border border-white/20 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="w-12 h-12 ring-2 ring-white/50">
                    <AvatarImage src={post.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-foreground group-hover:text-emerald-600 transition-colors">
                        {post.author}
                      </h4>
                      <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-0 px-3 py-1">
                        {post.role}
                      </Badge>
                      {post.helpful && (
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white border-0 px-3 py-1 animate-pulse">
                          <Zap className="w-3 h-3 mr-1" />
                          Helpful
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 font-medium">{post.time}</p>
                    <p className="text-foreground mb-4 leading-relaxed text-base">{post.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl px-4 py-2 transition-all duration-300"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="font-medium">{post.likes}</span>
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 rounded-xl px-4 py-2 transition-all duration-300"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">{post.comments}</span>
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-2 text-muted-foreground hover:text-green-500 hover:bg-green-50 rounded-xl px-4 py-2 transition-all duration-300"
                        >
                          <Share className="w-4 h-4" />
                          <span className="font-medium">Share</span>
                        </Button>
                      </div>

                      <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0 px-3 py-1">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <Card className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="p-4 bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-sm border border-white/30 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <h4 className="font-bold text-base mb-2 text-foreground">{session.title}</h4>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">by {session.mentor}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {session.time} • {session.location}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">{session.spots} spots left</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => joinSession(session.id)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white px-4"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-white/90 to-emerald-50/90 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <span className="text-sm font-medium text-foreground">Tips Shared</span>
                <span className="font-bold text-xl text-blue-600">5</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <span className="text-sm font-medium text-foreground">Helpful Votes</span>
                <span className="font-bold text-xl text-green-600">23</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <span className="text-sm font-medium text-foreground">Sessions Attended</span>
                <span className="font-bold text-xl text-purple-600">8</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                <span className="text-sm font-medium text-foreground">Community Rank</span>
                <span className="font-bold text-xl text-orange-600">#12</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
