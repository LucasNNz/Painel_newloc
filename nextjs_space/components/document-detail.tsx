
"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Download, Calendar, FileText, Package, User, CheckCircle, Clock, XCircle } from 'lucide-react';

interface DocumentDetailProps {
  document: {
    id: string;
    date: Date;
    cliente: string;
    dataDocumento: Date;
    remessa: string;
    contrato: string;
    operacao: string;
    patrimonios: any;
    documentacaoImagem: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export default function DocumentDetail({ document }: DocumentDetailProps) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const patrimoniosArray = Array.isArray(document.patrimonios) ? document.patrimonios : [];
  const imageUrl = `data:image/jpeg;base64,${document.documentacaoImagem}`;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluido':
      case 'concluído':
      case 'finalizado':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pendente':
      case 'em andamento':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'cancelado':
      case 'erro':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluido':
      case 'concluído':
      case 'finalizado':
        return 'bg-green-600/20 text-green-400 border-green-600';
      case 'pendente':
      case 'em andamento':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600';
      case 'cancelado':
      case 'erro':
        return 'bg-red-600/20 text-red-400 border-red-600';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600';
    }
  };

  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      const link = window.document.createElement('a');
      link.href = imageUrl;
      link.download = `documento_${document.remessa}_${document.contrato}.jpg`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-[#f4c400] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <div className="flex items-center gap-2">
          {getStatusIcon(document.status)}
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(document.status)}`}>
            {document.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Documento da Remessa: <span className="text-[#f4c400]">{document.remessa}</span>
        </h1>
        <p className="text-gray-400">
          Detalhes completos da operação e documentação
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="order-2 lg:order-1">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Documentação</h2>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-[#f4c400] text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>
            </div>
            
            <div className="relative aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden">
              {document.documentacaoImagem ? (
                <Image
                  src={imageUrl}
                  alt={`Documento ${document.remessa}`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <FileText className="w-16 h-16" />
                  <p>Imagem não disponível</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Informações Básicas</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#f4c400]" />
                <div>
                  <p className="text-sm text-gray-400">Cliente</p>
                  <p className="text-white font-medium">{document.cliente}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#f4c400]" />
                <div>
                  <p className="text-sm text-gray-400">Contrato</p>
                  <p className="text-white font-medium">{document.contrato}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-[#f4c400]" />
                <div>
                  <p className="text-sm text-gray-400">Operação</p>
                  <p className="text-white font-medium capitalize">{document.operacao}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#f4c400]" />
                <div>
                  <p className="text-sm text-gray-400">Data do Documento</p>
                  <p className="text-white font-medium">{formatDate(document.dataDocumento)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Registro</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Criado em</p>
                <p className="text-white">{formatDateTime(document.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Última atualização</p>
                <p className="text-white">{formatDateTime(document.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patrimônios */}
      <div className="mt-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">
            Patrimônios ({patrimoniosArray.length} item{patrimoniosArray.length !== 1 ? 's' : ''})
          </h3>
          
          {patrimoniosArray.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patrimoniosArray.map((patrimonio, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-[#f4c400]" />
                    <span className="text-sm text-gray-400">Item {index + 1}</span>
                  </div>
                  <p className="text-white text-sm">
                    {typeof patrimonio === 'string' 
                      ? patrimonio 
                      : JSON.stringify(patrimonio, null, 2)
                    }
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Nenhum patrimônio registrado</p>
          )}
        </div>
      </div>
    </div>
  );
}
