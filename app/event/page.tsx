'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Globe, Link as LinkIcon, Mail, Upload, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

export default function AddNewEvent() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
      <Button 
        variant="outline" 
        className="absolute top-4 left-4 bg-white text-black hover:bg-gray-200"
        onClick={() => router.push('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mt-16"
      >
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Add New Event</CardTitle>
            <CardDescription>Fill in the details to create a new AyaHQ ecosystem event.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input id="email" type="email" placeholder="your@email.com" className="pl-10 text-black" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-black">Event Title</Label>
                <Input id="title" placeholder="Enter event title" className="text-black" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-black">Event Image</Label>
                <div className="flex items-center space-x-4">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('image')?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  {imagePreview && (
                    <img src={imagePreview} alt="Event preview" className="h-20 w-20 object-cover rounded" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-black">Event Description</Label>
                <Textarea id="description" placeholder="Describe your event" rows={4} className="text-black" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-black">Timezone</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Select required>
                    <SelectTrigger className="pl-10 text-black">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                      <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                      {/* Add more timezone options as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-black">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input id="startDate" type="date" className="pl-10 text-black" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-black">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input id="endDate" type="date" className="pl-10 text-black" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-black">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input id="startTime" type="time" className="pl-10 text-black" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-black">End Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input id="endTime" type="time" className="pl-10 text-black" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventLink" className="text-black">Event Link</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input id="eventLink" type="url" placeholder="https://your-event-link.com" className="pl-10 text-black" required />
                </div>
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">Create Event</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
