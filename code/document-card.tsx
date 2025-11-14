
"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, Calendar, Package, User } from 'lucide-react';

interface DocumentProps {
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
  };
}

export default function DocumentCard({ document }: DocumentProps) {
  const router = useRouter();

  // Extrair primeiros patrimônios para preview
  const patrimoniosArray = Array.isArray(document.patrimonios) ? document.patrimonios : [];
  const previewPatrimonios = patrimoniosArray.slice(0, 2);
  const remainingCount = Math.max(0, patrimoniosArray.length - 2);

  // Criar URL da imagem base64
  const imageUrl = `data:image/jpeg;base64,${document.documentacaoImagem}`;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
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

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-[#f4c400]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#f4c400]/10">
      {/* Image Thumbnail */}
      <div className="relative h-48 bg-gray-800">
        {document.documentacaoImagem ? (
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={`Documento ${document.remessa}`}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <Package className="w-12 h-12" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(document.status)}`}>
            {document.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-[#f4c400]" />
          <span className="text-[#f4c400] font-semibold">{document.cliente}</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Remessa: {document.remessa}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(document.dataDocumento)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Package className="w-4 h-4" />
            <span className="capitalize">{document.operacao}</span>
          </div>
        </div>

        {/* Patrimônios Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Patrimônios:</h4>
          <div className="space-y-1">
            {previewPatrimonios.map((patrimonio, index) => (
              <div key={index} className="text-sm text-gray-400 truncate">
                • {typeof patrimonio === 'string' ? patrimonio : JSON.stringify(patrimonio)}
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="text-sm text-[#f4c400]">
                +{remainingCount} item{remainingCount !== 1 ? 's' : ''} adiciona{remainingCount !== 1 ? 'is' : 'l'}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push(`/documento/${document.id}`)}
          className="w-full bg-[#f4c400] text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
