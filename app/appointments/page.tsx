'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { BookAppointmentButton } from '@/components/book-appointment-button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  HeartPulse,
  Droplets,
  Droplet,
  Filter,
  SortAsc,
  ArrowUpRight,
  Search as SearchIcon,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react'
import EPrescription from '@/components/bento/e-prescription'
import SecureMedicalRecord from '@/components/bento/secure-medical-record'

interface Professional {
  id: string
  name: string
  specialty: string
  location: string
  avatar: string
}

// Données fictives – en production, récupérer depuis la BDD / Supabase
const PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Dr. Alice Martin',
    specialty: 'Cardiologie',
    location: 'Paris',
    avatar: '/images/avatars/darlene-robertson.png',
  },
  {
    id: '2',
    name: 'Dr. Benjamin Leroy',
    specialty: 'Dermatologie',
    location: 'Lyon',
    avatar: '/images/avatars/cody-fisher.png',
  },
  {
    id: '3',
    name: 'Dr. Clara Dubois',
    specialty: 'Pédiatrie',
    location: 'Marseille',
    avatar: '/images/avatars/dianne-russell.png',
  },
  {
    id: '4',
    name: 'Dr. Damien Lucas',
    specialty: 'Généraliste',
    location: 'Bordeaux',
    avatar: '/images/avatars/albert-flores.png',
  },
  {
    id: '5',
    name: 'Dr. Emma Caron',
    specialty: 'Nutrition',
    location: 'Lille',
    avatar: '/images/avatars/annette-black.png',
  },
]

// Fausse liste de rendez-vous récents
const LATEST_APPOINTMENTS = [
  { id: 1, name: 'Dr. Asmira Amri', specialty: 'Cardiologue', date: '15 Nov 2024', avatar: '/images/avatars/robert-fox.png' },
  { id: 2, name: 'Dr. Casandra', specialty: 'Pédiatre', date: '2 Nov 2024', avatar: '/images/avatars/darlene-robertson.png' },
  { id: 3, name: 'Dr. Imannuel John', specialty: 'Médecin généraliste', date: '13 Oct 2024', avatar: '/images/avatars/cody-fisher.png' },
  { id: 4, name: 'Dr. Hugo Olafson', specialty: 'Neurologue', date: '11 Aug 2024', avatar: '/images/avatars/albert-flores.png' },
]

export default function AppointmentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const firstName =
    (user?.user_metadata?.first_name as string | undefined) ??
    (user?.user_metadata?.firstName as string | undefined) ??
    ''

  // Recherche & filtres pour la liste de professionnels
  const [searchPro, setSearchPro] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [location, setLocation] = useState('')

  const filteredProfessionals = useMemo(() => {
    return PROFESSIONALS.filter((pro) => {
      const matchesSearch = pro.name.toLowerCase().includes(searchPro.toLowerCase())
      const matchesSpecialty = specialty ? pro.specialty === specialty : true
      const matchesLocation = location ? pro.location === location : true
      return matchesSearch && matchesSpecialty && matchesLocation
    })
  }, [searchPro, specialty, location])

  const specialties = Array.from(new Set(PROFESSIONALS.map((p) => p.specialty)))
  const locations = Array.from(new Set(PROFESSIONALS.map((p) => p.location)))

  // Mock data lists (replace with real fetch)
  const ePrescriptions: unknown[] = []
  const medicalRecords: unknown[] = []

  const handleBook = (pro: Professional, type: 'physical' | 'video') => {
    router.push(`/appointments/book?proId=${pro.id}&type=${type}`)
  }

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-muted/40 py-10">
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Colonne principale */}
        <div>
          {/* Header */}
          <header className="mb-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Bonjour, <span className="text-pink-600">{firstName}</span>
            </h1>
            <p className="text-muted-foreground">
              Vous avez <span className="font-semibold text-pink-600">1</span> rendez-vous aujourd’hui
            </p>

            {/* Barre de recherche + actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher"
                  className="pl-10"
                  value={searchPro}
                  onChange={(e) => setSearchPro(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2 shrink-0">
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline" className="gap-2 shrink-0">
                <SortAsc className="h-4 w-4" />
                Trier
              </Button>
            </div>
          </header>

          {/* Widgets santé */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {/* Heart Rate */}
            <div className="col-span-1 bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Heart Rate</span>
                <HeartPulse className="h-4 w-4 text-pink-500" />
              </div>
              <div className="text-3xl font-semibold">120</div>
              <span className="text-xs text-muted-foreground">BPM</span>
            </div>
            {/* Blood Cell */}
            <div className="col-span-1 bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Blood Cell</span>
                <Droplets className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-3xl font-semibold">9800</div>
              <span className="text-xs text-muted-foreground">uL</span>
            </div>
            {/* Water */}
            <div className="col-span-1 bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Water</span>
                <Droplet className="h-4 w-4 text-sky-500" />
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: '89%' }} />
              </div>
              <span className="text-xs text-muted-foreground">89% — 1.78/2 litres</span>
            </div>
            {/* Add Widget (espace réservé) */}
            <button className="col-span-1 bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/40 flex flex-col items-center justify-center py-6 hover:bg-muted/40 transition-colors">
              <span className="bg-foreground text-background rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none mb-2">
                +
              </span>
              <span className="text-xs font-medium text-muted-foreground">Ajouter</span>
            </button>
          </div>

          {/* Section rendez-vous récents + compléments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Derniers rendez vous */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Derniers rendez-vous</div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Restez informé de vos dernières visites médicales.
              </p>

              <div className="flex flex-col gap-3">
                {LATEST_APPOINTMENTS.map((appt) => (
                  <div key={appt.id} className="flex items-center gap-3 py-2 hover:bg-muted/20 px-2 rounded-lg transition-colors">
                    <Image src={appt.avatar} alt={appt.name} width={38} height={38} className="rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{appt.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {appt.specialty} • {appt.date}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Suppléments */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Vos compléments</div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                N’oubliez pas de prendre vos vitamines aujourd’hui !
              </p>

              <div className="grid grid-cols-3 gap-4 text-xs text-center">
                {['Fish Oil', 'Vitamine B', 'Stamina', 'Blood Boost', 'Skin Care', 'Bone Med'].map((supp, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                    <span>{supp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Ordonnances / Dossiers médicaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-3xl border border-white/20 bg-white/40 backdrop-blur-lg shadow-lg p-4 flex flex-col gap-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Ordonnances électroniques
              </h3>
              <div className="flex-1">
                {ePrescriptions.length ? (
                  <EPrescription />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Aucune donnée pour le moment</p>
                )}
              </div>
              <Button variant="outline" size="sm" className="self-end mt-2" disabled={!ePrescriptions.length}>
                Tout voir
              </Button>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/40 backdrop-blur-lg shadow-lg p-4 flex flex-col gap-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Dossiers médicaux sécurisés
              </h3>
              <div className="flex-1">
                {medicalRecords.length ? (
                  <SecureMedicalRecord />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Aucune donnée pour le moment</p>
                )}
              </div>
              <Button variant="outline" size="sm" className="self-end mt-2" disabled={!medicalRecords.length}>
                Derniers enregistrements
              </Button>
            </div>
          </div>

          {/* Section recherche de professionnels (existante) */}
          <h2 className="text-xl font-semibold mb-6">Trouver un professionnel</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                placeholder="Nom du médecin…"
                value={searchPro}
                onChange={(e) => setSearchPro(e.target.value)}
              />

              <Select value={specialty || 'all'} onValueChange={(val) => setSpecialty(val === 'all' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les spécialités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={location || 'all'} onValueChange={(val) => setLocation(val === 'all' ? '' : val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredProfessionals.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                Aucun professionnel ne correspond à vos critères.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfessionals.map((pro) => (
                  <div
                    key={pro.id}
                    className="group bg-muted/10 hover:bg-muted/20 transition-colors rounded-2xl overflow-hidden border border-muted-foreground/10 shadow-sm"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={pro.avatar}
                        alt={pro.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <h3 className="font-medium truncate text-sm">{pro.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{pro.specialty}</p>
                      <p className="text-xs text-muted-foreground mb-2 truncate">{pro.location}</p>
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[11px]"
                          onClick={() => handleBook(pro, 'physical')}
                        >
                          Présentiel
                        </Button>
                        <Button
                          size="sm"
                          className="text-[11px]"
                          onClick={() => handleBook(pro, 'video')}
                        >
                          Visio
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite – prochain rendez-vous */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex-1 flex flex-col">
            <div className="p-6 border-b border-muted/20 flex items-center justify-between">
              <span className="font-semibold">Prochain rendez-vous</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="relative h-64 w-full">
              <Image
                src="/images/avatars/darlene-robertson.png"
                alt="Docteur"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex flex-col gap-3">
              <h3 className="text-lg font-semibold">Dr. Sasmita RA</h3>
              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full w-max">Dentiste</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dr. Samita est une dentiste dévouée fournissant des soins de qualité avec une attention particulière portée au confort et à la satisfaction du patient.
                <Button variant="link" className="px-1 h-auto text-xs">Voir plus</Button>
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarIcon className="h-4 w-4" /> 23 Nov, 12:30 PM
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" /> 30 minutes
              </div>
              <Button className="mt-4">Voir les rendez-vous</Button>
            </div>
          </div>

          {/* CTA mobile affiché sur grand écran aussi */}
          <BookAppointmentButton fullWidth />
        </aside>
      </div>
    </div>
  )
} 