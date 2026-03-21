'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Testimonial = {
  id: number
  client_name: string
  text: string
  is_approved: boolean
  created_at: string
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to load testimonials: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: true })
        .eq('id', id)

      if (error) throw error

      setTestimonials(prev =>
        prev.map(t => (t.id === id ? { ...t, is_approved: true } : t))
      )
      setMessage({ type: 'success', text: 'Testimonial approved!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to approve: ${error.message}` })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTestimonials(prev => prev.filter(t => t.id !== id))
      setMessage({ type: 'success', text: 'Testimonial deleted!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to delete: ${error.message}` })
    }
  }

  const pendingTestimonials = testimonials.filter(t => !t.is_approved)
  const approvedTestimonials = testimonials.filter(t => t.is_approved)

  return (
    <div className="space-y-8">
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pending Testimonials ({pendingTestimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : pendingTestimonials.length === 0 ? (
            <p className="text-muted-foreground">No pending testimonials.</p>
          ) : (
            <div className="space-y-6">
              {pendingTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-4 border border-border/50 rounded-lg space-y-3"
                >
                  <blockquote className="text-lg italic text-foreground/90">
                    {testimonial.text}
                  </blockquote>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{testimonial.client_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(testimonial.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approved Testimonials ({approvedTestimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {approvedTestimonials.length === 0 ? (
            <p className="text-muted-foreground">No approved testimonials yet.</p>
          ) : (
            <div className="space-y-6">
              {approvedTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-4 border border-border/50 rounded-lg space-y-3"
                >
                  <blockquote className="text-lg italic text-foreground/90">
                    {testimonial.text}
                  </blockquote>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{testimonial.client_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}