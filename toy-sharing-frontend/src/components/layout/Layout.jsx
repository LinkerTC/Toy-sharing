import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { motion } from 'framer-motion'

import Navbar from './Navbar'
import Footer from './Footer'
import { Loading } from '@/components/ui/Spinner'
import { useTheme } from '@/context/ThemeContext'

const Layout = () => {
  const { getThemeClasses } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col ${getThemeClasses()}`}>
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<Loading fullScreen message="Đang tải trang..." />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

export default Layout