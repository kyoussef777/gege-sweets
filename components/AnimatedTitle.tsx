'use client'

import { useState, useEffect } from 'react'

export default function AnimatedTitle() {
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  const words = ['GeGe', 'جيجي']

  useEffect(() => {
    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const currentWord = words[wordIndex]
    const typingSpeed = isDeleting ? 120 : 250
    const pauseTime = isDeleting ? 800 : 3000

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.substring(0, displayText.length + 1))
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseTime)
          return
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentWord.substring(0, displayText.length - 1))
        } else {
          // Finished deleting, switch word
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
          return
        }
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, wordIndex])

  return (
    <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4 tracking-tight">
      <span style={{ fontFamily: wordIndex === 1 ? 'Georgia, serif' : 'inherit' }}>
        {displayText}
      </span>
      <span
        className="ml-1 border-r-4 border-egyptian-gold"
        style={{
          opacity: showCursor ? 1 : 0,
          transition: 'opacity 0.1s',
          display: 'inline-block',
          height: '0.9em',
          verticalAlign: 'middle',
        }}
      />
      {' Sweets'}
    </h1>
  )
}
