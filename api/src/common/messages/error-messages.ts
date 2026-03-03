// Mensagens de erro amigáveis para o sistema ASCESA

export const ErrorMessages = {
  // Autenticação
  AUTH: {
    INVALID_CREDENTIALS: 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
    EMAIL_NOT_FOUND: 'Não encontramos uma conta com este email.',
    ACCOUNT_INACTIVE: 'Sua conta está inativa. Entre em contato com o administrador.',
    ACCOUNT_PENDING: 'Sua conta está em análise. Aguarde a aprovação do administrador.',
    INVALID_TOKEN: 'Token inválido ou expirado. Solicite um novo link.',
    PASSWORD_MISMATCH: 'As senhas não coincidem. Verifique e tente novamente.',
    WEAK_PASSWORD: 'A senha deve ter pelo menos 6 caracteres.',
    EMAIL_ALREADY_EXISTS: 'Já existe uma conta com este email.',
    UNAUTHORIZED: 'Você precisa estar logado para acessar esta funcionalidade.',
    FORBIDDEN: 'Você não tem permissão para realizar esta ação.',
  },

  // Usuários
  USER: {
    NOT_FOUND: 'Usuário não encontrado.',
    ALREADY_ACTIVE: 'Este usuário já está ativo.',
    ALREADY_INACTIVE: 'Este usuário já está inativo.',
    CANNOT_DISABLE_ADMIN: 'Não é possível desativar um administrador.',
    INVALID_STATUS: 'Status de usuário inválido.',
  },

  // Associados
  ASSOCIATE: {
    NOT_FOUND: 'Associado não encontrado.',
    CPF_ALREADY_EXISTS: 'Já existe um associado com este CPF.',
    APPROVED: 'Associado aprovado com sucesso!',
    REJECTED: 'Associado rejeitado. O candidato foi notificado.',
    APPROVAL_FAILED: 'Não foi possível aprovar o associado. Tente novamente.',
    REJECTION_FAILED: 'Não foi possível rejeitar o associado. Tente novamente.',
  },

  // Eventos
  EVENT: {
    NOT_FOUND: 'Evento não encontrado.',
    CREATE_FAILED: 'Não foi possível criar o evento. Verifique os dados e tente novamente.',
    UPDATE_FAILED: 'Não foi possível atualizar o evento. Tente novamente.',
    DELETE_FAILED: 'Não foi possível excluir o evento. Tente novamente.',
    FULL: 'Este evento atingiu o número máximo de vagas.',
    ALREADY_FULL: 'Não há vagas disponíveis para este evento.',
    ALREADY_ENROLLED: 'Você já está inscrito neste evento.',
    ENROLLMENT_FAILED: 'Não foi possível realizar sua inscrição. Tente novamente.',
    ENROLLMENT_NOT_FOUND: 'Inscrição não encontrada.',
  },

  // Vitrine/Produtos
  SHOWCASE: {
    NOT_FOUND: 'Produto não encontrado.',
    CREATE_FAILED: 'Não foi possível criar o produto. Verifique os dados e tente novamente.',
    UPDATE_FAILED: 'Não foi possível atualizar o produto. Tente novamente.',
    DELETE_FAILED: 'Não foi possível excluir o produto. Tente novamente.',
    CONTACT_FAILED: 'Não foi possível enviar a mensagem para o vendedor.',
  },

  // Parceiros
  PARTNER: {
    NOT_FOUND: 'Parceiro não encontrado.',
    CREATE_FAILED: 'Não foi possível criar o parceiro. Verifique os dados e tente novamente.',
    UPDATE_FAILED: 'Não foi possível atualizar o parceiro. Tente novamente.',
    DELETE_FAILED: 'Não foi possível excluir o parceiro. Tente novamente.',
    CNPJ_ALREADY_EXISTS: 'Já existe um parceiro com este CNPJ.',
  },

  // Benefícios
  BENEFIT: {
    NOT_FOUND: 'Benefício não encontrado.',
    CREATE_FAILED: 'Não foi possível criar o benefício. Verifique os dados e tente novamente.',
    UPDATE_FAILED: 'Não foi possível atualizar o benefício. Tente novamente.',
    DELETE_FAILED: 'Não foi possível excluir o benefício. Tente novamente.',
  },

  // Fórum
  FORUM: {
    TOPIC_NOT_FOUND: 'Tópico não encontrado.',
    REPLY_NOT_FOUND: 'Resposta não encontrada.',
    CREATE_TOPIC_FAILED: 'Não foi possível criar o tópico. Tente novamente.',
    CREATE_REPLY_FAILED: 'Não foi possível enviar sua resposta. Tente novamente.',
    DELETE_FAILED: 'Não foi possível excluir. Tente novamente.',
    TOPIC_LOCKED: 'Este tópico está fechado e não aceita novas respostas.',
    ALREADY_FIXED: 'Este tópico já está fixado.',
    ALREADY_UNFIXED: 'Este tópico já está desafixado.',
    ALREADY_CLOSED: 'Este tópico já está fechado.',
    ALREADY_OPEN: 'Este tópico já está aberto.',
  },

  // Documentos
  DOCUMENT: {
    NOT_FOUND: 'Documento não encontrado.',
    UPLOAD_FAILED: 'Não foi possível fazer upload do documento. Tente novamente.',
    APPROVE_FAILED: 'Não foi possível aprovar o documento. Tente novamente.',
    REJECT_FAILED: 'Não foi possível rejeitar o documento. Tente novamente.',
    ALREADY_APPROVED: 'Este documento já foi aprovado.',
    ALREADY_REJECTED: 'Este documento já foi rejeitado.',
  },

  // Assembléias
  ASSEMBLY: {
    NOT_FOUND: 'Assembléias não encontrada.',
    CREATE_FAILED: 'Não foi possível criar a assembléias. Tente novamente.',
    UPDATE_FAILED: 'Não foi possível atualizar a assembléias. Tente novamente.',
    DELETE_FAILED: 'Não foi possível excluir a assembléias. Tente novamente.',
    VOTING_CLOSED: 'A votação está encerrada.',
    ALREADY_VOTED: 'Você já votou nesta chapa.',
    CANDIDATE_NOT_FOUND: 'Candidato não encontrado.',
    CANDIDATE_ALREADY_EXISTS: 'Já existe um candidato com este número.',
  },

  // Pagamentos
  PAYMENT: {
    NOT_FOUND: 'Pagamento não encontrado.',
    CREATE_FAILED: 'Não foi possível processar o pagamento. Tente novamente.',
    UPDATE_FAILED: 'Não foi possível atualizar o pagamento. Tente novamente.',
    ALREADY_PAID: 'Este pagamento já foi quitado.',
    INVALID_AMOUNT: 'Valor inválido para pagamento.',
  },

  // Validação genérica
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo é obrigatório.',
    INVALID_EMAIL: 'Por favor, insira um email válido.',
    INVALID_CPF: 'Por favor, insira um CPF válido.',
    INVALID_CNPJ: 'Por favor, insira um CNPJ válido.',
    INVALID_DATE: 'Por favor, insira uma data válida.',
    MIN_LENGTH: 'Este campo deve ter pelo menos {min} caracteres.',
    MAX_LENGTH: 'Este campo deve ter no máximo {max} caracteres.',
    MIN_VALUE: 'O valor mínimo é {min}.',
    MAX_VALUE: 'O valor máximo é {max}.',
    INVALID_FORMAT: 'Formato inválido.',
  },

  // Erros de servidor
  SERVER: {
    INTERNAL_ERROR: 'Algo deu errado. Tente novamente em alguns minutos.',
    DATABASE_ERROR: 'Erro de comunicação com o banco de dados. Tente novamente.',
    EXTERNAL_SERVICE_ERROR: 'Serviço temporariamente indisponível. Tente novamente mais tarde.',
    RATE_LIMIT: 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.',
  },

  // Sucesso genérico
  SUCCESS: {
    CREATED: 'Criado com sucesso!',
    UPDATED: 'Atualizado com sucesso!',
    DELETED: 'Excluído com sucesso!',
    SENT: 'Enviado com sucesso!',
    SAVED: 'Salvo com sucesso!',
  },
};

export type ErrorKey = keyof typeof ErrorMessages;
