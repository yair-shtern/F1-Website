import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Flag, Trophy } from 'lucide-react'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Home',
      active: location.pathname === '/'
    },
    { 
      path: '/drivers', 
      icon: Users, 
      label: 'Drivers',
      active: location.pathname === '/drivers'
    },
    { 
      path: '/races', 
      icon: Flag, 
      label: 'Races',
      active: location.pathname === '/races'
    },
    { 
      path: '/teams', 
      icon: Trophy, 
      label: 'Teams',
      active: location.pathname === '/teams'
    }
  ]

  return (
    <nav className="bg-white shadow-md fixed bottom-0 left-0 right-0 z-50 md:relative md:top-0">
      <div className="flex justify-around items-center p-3">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              item.active 
                ? 'text-f1-red bg-red-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon 
              size={24} 
              strokeWidth={item.active ? 2.5 : 1.5}
            />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navigation