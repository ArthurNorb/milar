'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TestimonialForm() {
  const [clientName, setClientName] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          client_name: clientName,
          text,
          is_approved: false,
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Obrigada pelo seu depoimento! Ele será revisado antes de aparecer no site.' })
      setClientName('')
      setText('')
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erro ao enviar depoimento: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deixe seu depoimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Seu nome</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="text">Seu depoimento</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Compartilhe sua experiência com a Milar Arquitetura..."
              rows={4}
              required
            />
          </div>
          {message && (
            <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Enviando...' : 'Enviar depoimento'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Seu depoimento será revisado antes de ser publicado no site.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}