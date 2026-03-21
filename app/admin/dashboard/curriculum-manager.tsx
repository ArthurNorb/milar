'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type CurriculumItem = {
  id: number
  type: 'education' | 'experience' | 'skill'
  title: string
  description: string | null
  start_year: number | null
  end_year: number | null
}

export default function CurriculumManager() {
  const [items, setItems] = useState<CurriculumItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvUrl, setCvUrl] = useState<string | null>(null)

  // Form state for editing
  const [editingItem, setEditingItem] = useState<CurriculumItem | null>(null)
  const [formType, setFormType] = useState<'education' | 'experience' | 'skill'>('education')
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formStartYear, setFormStartYear] = useState('')
  const [formEndYear, setFormEndYear] = useState('')

  useEffect(() => {
    fetchCurriculum()
    fetchCvUrl()
  }, [])

  const fetchCurriculum = async () => {
    try {
      const { data, error } = await supabase
        .from('curriculum')
        .select('*')
        .order('type')
        .order('start_year', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to load curriculum: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const fetchCvUrl = async () => {
    try {
      const { data } = await supabase.storage
        .from('project-images')
        .list('cv', { limit: 1 })

      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(`cv/${data[0].name}`)
        setCvUrl(urlData.publicUrl)
      }
    } catch (error) {
      console.error('Failed to fetch CV URL:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const itemData = {
      type: formType,
      title: formTitle,
      description: formDescription || null,
      start_year: formStartYear ? parseInt(formStartYear) : null,
      end_year: formEndYear ? parseInt(formEndYear) : null,
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('curriculum')
          .update(itemData)
          .eq('id', editingItem.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Item updated!' })
      } else {
        const { error } = await supabase
          .from('curriculum')
          .insert(itemData)

        if (error) throw error
        setMessage({ type: 'success', text: 'Item added!' })
      }

      fetchCurriculum()
      resetForm()
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to save: ${error.message}` })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const { error } = await supabase
        .from('curriculum')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItems(prev => prev.filter(item => item.id !== id))
      setMessage({ type: 'success', text: 'Item deleted!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to delete: ${error.message}` })
    }
  }

  const handleEdit = (item: CurriculumItem) => {
    setEditingItem(item)
    setFormType(item.type)
    setFormTitle(item.title)
    setFormDescription(item.description || '')
    setFormStartYear(item.start_year?.toString() || '')
    setFormEndYear(item.end_year?.toString() || '')
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormType('education')
    setFormTitle('')
    setFormDescription('')
    setFormStartYear('')
    setFormEndYear('')
  }

  const handleCvUpload = async () => {
    if (!cvFile) return

    try {
      // Ensure cv bucket exists (create if not)
      const fileExt = cvFile.name.split('.').pop()
      const fileName = `cv_${Date.now()}.${fileExt}`
      const filePath = `cv/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, cvFile, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      setCvUrl(urlData.publicUrl)
      setMessage({ type: 'success', text: 'CV uploaded successfully!' })
      setCvFile(null)
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to upload CV: ${error.message}` })
    }
  }

  const groupedItems = {
    education: items.filter(item => item.type === 'education'),
    experience: items.filter(item => item.type === 'experience'),
    skill: items.filter(item => item.type === 'skill'),
  }

  return (
    <div className="space-y-8">
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>CV PDF Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Upload CV (PDF)</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-muted-foreground">
              Upload a PDF version of Giovanna's CV. This will be available for download on the public curriculum page.
            </p>
          </div>
          {cvUrl && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current CV:</p>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View/Download CV
              </a>
            </div>
          )}
          <Button onClick={handleCvUpload} disabled={!cvFile}>
            Upload CV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formType} onValueChange={(value: any) => setFormType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="skill">Skill</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="UFOP - Universidade Federal de Ouro Preto"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Bacharelado em Arquitetura e Urbanismo"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startYear">Start Year (optional)</Label>
                <Input
                  id="startYear"
                  type="number"
                  value={formStartYear}
                  onChange={(e) => setFormStartYear(e.target.value)}
                  placeholder="2016"
                  min="1900"
                  max="2100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endYear">End Year (optional)</Label>
                <Input
                  id="endYear"
                  type="number"
                  value={formEndYear}
                  onChange={(e) => setFormEndYear(e.target.value)}
                  placeholder="2021"
                  min="1900"
                  max="2100"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
              {editingItem && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold mb-4">Education</h3>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : groupedItems.education.length === 0 ? (
            <p className="text-muted-foreground">No education entries.</p>
          ) : (
            <div className="space-y-4">
              {groupedItems.education.map((item) => (
                <div key={item.id} className="p-4 border border-border/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      {item.description && <p className="text-muted-foreground">{item.description}</p>}
                      {(item.start_year || item.end_year) && (
                        <p className="text-sm text-muted-foreground">
                          {item.start_year} - {item.end_year || 'Present'}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Experience</h3>
          {groupedItems.experience.length === 0 ? (
            <p className="text-muted-foreground">No experience entries.</p>
          ) : (
            <div className="space-y-4">
              {groupedItems.experience.map((item) => (
                <div key={item.id} className="p-4 border border-border/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      {item.description && <p className="text-muted-foreground">{item.description}</p>}
                      {(item.start_year || item.end_year) && (
                        <p className="text-sm text-muted-foreground">
                          {item.start_year} - {item.end_year || 'Present'}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Skills</h3>
          {groupedItems.skill.length === 0 ? (
            <p className="text-muted-foreground">No skill entries.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {groupedItems.skill.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-3 py-2 border border-border/50 rounded-lg"
                >
                  <span>{item.title}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => handleDelete(item.id)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}