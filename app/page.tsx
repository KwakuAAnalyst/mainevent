'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, Calendar, X, ChevronRight, Wallet, LogOut, Copy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import Web3 from 'web3'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import TransgateConnect  from '@zkpass/transgate-js-sdk'
import verifyEvmBasedResult from './verifyevmbasedresults'
import Image from 'next/image'
import { VerifyEvmBasedResultParams } from './types'

// Mock event data
const eventData: Record<string, Array<{ title: string; time: string; description: string }>> = {
  "2024-10-20": [{ title: "Aya Builders Meetup", time: "14:00", description: "Join us for an Aya Builders community meetup!" }],
  "2024-11-05": [{ title: "Blockchain Workshop", time: "10:00", description: "Learn about blockchain technology and its applications." }],
  "2024-11-15": [{ title: "Hackathon Kickoff", time: "09:00", description: "Start of our annual blockchain hackathon." }],
}

export default function Component() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showUpcomingEvents, setShowUpcomingEvents] = useState(false)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [selectedUpcomingEvent, setSelectedUpcomingEvent] = useState<string | null>(null)
  const [showWalletPopup, setShowWalletPopup] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [walletError, setWalletError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const router = useRouter()
  const [appId] = useState<string>('30453a18-49b3-4f2b-bc6b-9879cfb51d1a')
  const [schemaId] = useState<string>('2efae1062c494f94adad29b5718e2efb')


  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  const getMonthData = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { year, month, firstDay, daysInMonth }
  }

  const currentMonthData = getMonthData(currentDate)
  const nextMonthData = getMonthData(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const renderCalendar = (monthData: { year: number; month: number; firstDay: number; daysInMonth: number }, isCurrentMonth: boolean) => {
    const { year, month, firstDay, daysInMonth } = monthData
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const blanks = Array.from({ length: firstDay }, (_, i) => i)

    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{new Date(year, month).toLocaleString('default', { month: 'long' })}</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-bold">
              {day}
            </div>
          ))}
          {blanks.map((_, index) => (
            <div key={`blank-${index}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const hasEvent = eventData[dateString]
            const isCurrentDay = isCurrentMonth && day === currentDate.getDate()
            return (
              <motion.button
                key={day}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                  isCurrentDay ? 'bg-yellow-300 text-black' : hasEvent ? 'bg-blue-500' : 'bg-white bg-opacity-10'
                }`}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(dateString)}
              >
                {day}
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderUpcomingEvents = () => {
    const today = new Date()
    const upcomingEvents = Object.entries(eventData)
      .filter(([date]) => new Date(date) >= today)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())

    const eventsToShow = showAllEvents ? upcomingEvents : upcomingEvents.slice(0, 3)

    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <>
            <div className="space-y-4">
              {eventsToShow.map(([date, events], index) => (
                <div key={date} 
                  className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    index === 0 ? 'bg-yellow-500 bg-opacity-30' : 'hover:bg-white hover:bg-opacity-10'
                  } ${selectedUpcomingEvent === date ? 'bg-blue-500 bg-opacity-30' : ''}`}
                  onClick={() => setSelectedUpcomingEvent(selectedUpcomingEvent === date ? null : date)}
                >
                  <Calendar className="h-6 w-6" />
                  <div className="flex-grow">
                    <p className="font-semibold">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <p>{events[0].title}</p>
                  </div>
                  <ChevronRight className={`h-6 w-6 transition-transform duration-200 ${selectedUpcomingEvent === date ? 'rotate-90' : ''}`} />
                </div>
              ))}
            </div>
            <AnimatePresence>
              {selectedUpcomingEvent && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 bg-white bg-opacity-10 p-4 rounded-lg"
                >
                  {eventData[selectedUpcomingEvent].map((event, index) => (
                    <div key={index} className="mb-2">
                      <h3 className="font-bold">{event.title}</h3>
                      <p>Time: {event.time}</p>
                      <p>{event.description}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {upcomingEvents.length > 3 && (
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-blue-300 hover:text-blue-100 mt-4"
                onClick={() => setShowAllEvents(!showAllEvents)}
              >
                {showAllEvents ? "View less" : "View more"}
              </Button>
            )}
          </>
        ) : (
          <p>No upcoming events at the moment.</p>
        )}
        <Button
          variant="link"
          className="p-0 h-auto font-normal text-blue-300 hover:text-blue-100 mt-4 block"
          onClick={() => console.log('Add event clicked')}
        >
          + Add a new event
        </Button>
      </div>
    )
  }

  const handleAddNewEvent = () => {
    if (!walletConnected) {
      const generate = async (schemaId: string, Appid: string) => {
        try {
          console.log(schemaId, Appid);
          const connector = new TransgateConnect(Appid);
          const isAvailable = await connector.isTransgateAvailable();
          if (isAvailable) {
            const res = await connector.launch(schemaId);
            // Add a type assertion to ensure all required properties are present
            await verifyEvmBasedResult(res as Required<VerifyEvmBasedResultParams>, schemaId);
          } else {
            alert('Please install the TransGate extension');
            console.log('Please install the TransGate extension');
          }
        } catch (error) {
          console.error('TransGate error', error);
        }
      };
      generate(schemaId, appId);
    } else {
      router.push('/event')
    }
  }

  const connectWallet = async () => {
    setWalletError(null);
    
    // Type-safe check for ethereum property on window
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Wallet connected')
        
        // Get the connected accounts
        const web3Instance = new Web3(window.ethereum)
        const accounts = await web3Instance.eth.getAccounts()
        
        if (accounts.length > 0) {
          const connectedAccount = accounts[0]
          setAccount(connectedAccount)
          setWalletConnected(true)
          setShowWalletPopup(false)

          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected.",
          })
        } else {
          setWalletError('No accounts found. Please make sure your wallet is unlocked.')
        }
      } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 4001) {
          setWalletError('You rejected the connection request. Please try again.')
        } else {
          setWalletError('Failed to connect wallet. Please try again.')
        }
        console.error('Failed to connect wallet:', error)
      }
    } else {
      setWalletError('No Ethereum wallet detected. Please install MetaMask or another web3 wallet.')
    }
  }

  const renderWalletPopup = () => (
    <Dialog open={showWalletPopup} onOpenChange={setShowWalletPopup}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Please connect your EVM wallet to add a new event.
          </DialogDescription>
        </DialogHeader>
        {walletError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{walletError}</span>
          </div>
        )}
        <Button onClick={connectWallet} className="mt-4">
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      </DialogContent>
    </Dialog>
  )

  const renderWalletDropdown = () => (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30">
          <Wallet className="mr-2 h-4 w-4" />
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white text-black p-4 rounded-lg shadow-xl">
        <DropdownMenuLabel className="text-lg font-bold mb-2">Wallet Info</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 my-2" />
        <div className="space-y-2">
          <div>
            <span className="font-medium text-sm text-gray-600">Address:</span>
            <div className="flex items-center mt-1">
              <span className="text-xs bg-gray-100 p-1 rounded mr-2 break-all">{account}</span>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0 flex-shrink-0"
                onClick={() => copyToClipboard(account || '')}
              >
                {copySuccess ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-gray-200 my-2" />
        <DropdownMenuItem 
          onClick={disconnectWallet}
          className="flex items-center justify-center w-full mt-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const disconnectWallet = () => {
    setAccount(null)
    setWalletConnected(false)
    setIsDropdownOpen(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  /*const handleNetworkSwitch = async (networkName: string): Promise<void> => {
    // Implementation
  }

  const switchNetwork = async (networkName: string): Promise<void> => {
    // Implementation
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    // Implementation
  }*/

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Image src="/ayhq.png" alt="AYHQ Logo" width={120} height={40} />
            <span className="text-2xl font-bold"></span>
          </div>
          <div className="flex items-center space-x-4">
            {walletConnected ? renderWalletDropdown() : (
              <Button variant="outline" className="bg-white text-black hover:bg-gray-200" onClick={() => setShowWalletPopup(true)}>
                <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
              </Button>
            )}
            <Button variant="outline" className="bg-white text-black hover:bg-gray-200" onClick={handleAddNewEvent}>
              <Plus className="mr-2 h-4 w-4" /> Add New Event
            </Button>
          </div>
        </header>

        <main>
          <h1 className="text-4xl font-bold mb-4">Aya Ecosystem Events</h1>
          <p className="text-xl mb-8">The latest AyaHQ Hub events in one place.</p>

          <div className="mb-8">
            <Select defaultValue="Africa/Accra (GMT+00:00)">
              <SelectTrigger className="w-full bg-white text-black">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Accra (GMT+00:00)">Africa/Accra (GMT+00:00)</SelectItem>
                <SelectItem value="Europe/London (GMT+01:00)">Europe/London (GMT+01:00)</SelectItem>
                <SelectItem value="America/New_York (GMT-04:00)">America/New_York (GMT-04:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {renderCalendar(currentMonthData, true)}
            {renderCalendar(nextMonthData, false)}
          </div>

          {renderUpcomingEvents()}

          <motion.div
            className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 mt-8"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: showUpcomingEvents ? 'auto' : 0, opacity: showUpcomingEvents ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="flex items-center text-xl font-bold mb-4"
              onClick={() => setShowUpcomingEvents(!showUpcomingEvents)}
            >
              Upcoming events
              <ChevronDown className={`ml-2 transition-transform ${showUpcomingEvents ? 'rotate-180' : ''}`} />
            </button>
            {showUpcomingEvents && (
              <div className="space-y-4">
                {Object.entries(eventData).map(([date, events]) => (
                  <div key={date} className="flex items-center space-x-4">
                    <Calendar className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      <p>{events[0].title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </motion.div>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Events for {selectedDate}</DialogTitle>
            <DialogDescription>
              {selectedDate && eventData[selectedDate] ? (
                eventData[selectedDate].map((event, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold">{event.title}</h3>
                    <p>Time: {event.time}</p>
                    <p>{event.description}</p>
                  </div>
                ))
              ) : (
                <p>No events scheduled for this day.</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {renderWalletPopup()}
    </div>
  )
}
