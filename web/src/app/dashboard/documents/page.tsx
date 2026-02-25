'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { API_ENDPOINTS, APP_ROUTES } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Document, DocumentStatus } from '@/lib/types';

const documentTypes = [
  { value: 'CPF', label: 'CPF' },
  { value: 'RG', label: 'RG' },
  { value: 'COMPROVANTE_RESIDENCIA', label: 'Comprovante de Residência' },
  { value: 'FOTO', label: 'Foto 3x4' },
  { value: 'OUTRO', label: 'Outro' },
] as const;

export default function DocumentsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>('CPF');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.documents.list(user.id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      setMessage('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', selectedType);
    formData.append('userId', user.id);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.documents.upload, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Documento enviado com sucesso!');
        setSelectedFile(null);
        loadDocuments();
      } else {
        setMessage(data.message || 'Erro ao enviar documento');
      }
    } catch {
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: DocumentStatus): string => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600';
      case 'REJECTED':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusLabel = (status: DocumentStatus): string => {
    switch (status) {
      case 'APPROVED':
        return 'Aprovado';
      case 'REJECTED':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  };

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Meus Documentos
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enviar Documento</CardTitle>
            <CardDescription>
              Envie os documentos necessários para completar seu cadastro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                  Tipo de Documento
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                  Arquivo
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                />
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Formatos aceitos: JPG, PNG, PDF (máximo 5MB)
                </p>
              </div>

              {message && (
                <p className={`text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? 'Enviando...' : 'Enviar Documento'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
              </div>
            ) : documents.length === 0 ? (
              <p className="text-[var(--muted-foreground)] text-center py-8">
                Nenhum documento enviado ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {documentTypes.find((t) => t.value === doc.type)?.label || doc.type}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {doc.filename} - {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`font-medium ${getStatusColor(doc.status)}`}>
                      {getStatusLabel(doc.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
