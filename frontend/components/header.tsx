"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  User,
  Settings,
  LogOut,
  MapPin,
  BookOpen,
  Users
} from "lucide-react"

interface HeaderProps {
  activeView?: string
  onViewChange?: (view: string) => void
}

export default function Header({ activeView, onViewChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { id: "home", title: "Home", icon: MapPin },
    { id: "map", title: "Campus Map", icon: MapPin },
    { id: "learn", title: "Learning", icon: BookOpen },
    { id: "community", title: "Community", icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu toggle for mobile */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-4">
            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    activeView === item.id 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                  onClick={() => onViewChange?.(item.id)}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.title}
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Center - Logo */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                raahi
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Search, Notifications, Profile */}
        <div className="flex items-center gap-2">
          {/* Search button */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                <h3 className="font-semibold text-sm mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New module available</p>
                      <p className="text-xs text-gray-500">Library Navigation 101 is now ready</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Achievement unlocked</p>
                      <p className="text-xs text-gray-500">You earned the "Explorer" badge</p>
                      <p className="text-xs text-gray-400">1 day ago</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                  View all notifications
                </Button>
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative group">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="hidden sm:inline text-sm">Profile</span>
            </Button>

            {/* Profile dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="font-medium text-sm">Student User</p>
                <p className="text-xs text-gray-500">student@campus.edu</p>
              </div>
              <div className="p-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    activeView === item.id 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                      : "text-gray-600"
                  }`}
                  onClick={() => {
                    onViewChange?.(item.id)
                    setIsMenuOpen(false)
                  }}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {item.title}
                </Button>
              )
            })}
          </nav>
        </div>
      )}

      {/* Backdrop for closing notifications/menu */}
      {(showNotifications || isMenuOpen) && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => {
            setShowNotifications(false)
            setIsMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}