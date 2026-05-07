const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.session.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const [orbitInternal, atlas, nova, clini] = await Promise.all([
    prisma.company.create({
      data: {
        name: "Orbit Internal",
        plan: "Enterprise"
      }
    }),
    prisma.company.create({
      data: {
        name: "Atlas Contabil",
        plan: "Pro"
      }
    }),
    prisma.company.create({
      data: {
        name: "Nova Saude",
        plan: "Business"
      }
    }),
    prisma.company.create({
      data: {
        name: "CliniFlow",
        plan: "Starter"
      }
    })
  ]);

  const [catAcesso, catFinanceiro, catIntegracoes, catInfra] = await Promise.all([
    prisma.category.create({
      data: { name: "Acesso", companyId: orbitInternal.id }
    }),
    prisma.category.create({
      data: { name: "Financeiro", companyId: orbitInternal.id }
    }),
    prisma.category.create({
      data: { name: "Integracoes", companyId: orbitInternal.id }
    }),
    prisma.category.create({
      data: { name: "Infraestrutura", companyId: orbitInternal.id }
    })
  ]);

  const [rafa, amanda, joao, marina] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Rafa Inacio",
        email: "rafa@orbitdesk.dev",
        passwordHash: "orbit123",
        role: "ADMIN",
        companyId: orbitInternal.id
      }
    }),
    prisma.user.create({
      data: {
        name: "Amanda Costa",
        email: "amanda@orbitdesk.dev",
        passwordHash: "orbit123",
        role: "AGENT",
        companyId: orbitInternal.id
      }
    }),
    prisma.user.create({
      data: {
        name: "Joao Lima",
        email: "joao@orbitdesk.dev",
        passwordHash: "orbit123",
        role: "SUPERVISOR",
        companyId: orbitInternal.id
      }
    }),
    prisma.user.create({
      data: {
        name: "Marina Alves",
        email: "marina@atlascontabil.com",
        passwordHash: "orbit123",
        role: "REQUESTER",
        companyId: atlas.id
      }
    })
  ]);

  await prisma.ticket.create({
    data: {
      ticketNumber: "#2481",
      title: "Falha ao acessar painel financeiro apos redefinicao de senha",
      description:
        "Cliente informa que redefiniu a senha, mas continua vendo erro ao abrir o painel financeiro.",
      companyId: atlas.id,
      requesterId: marina.id,
      assignedToId: rafa.id,
      categoryId: catAcesso.id,
      priority: "CRITICA",
      status: "EM_TRIAGEM",
      messages: {
        create: [
          {
            senderId: marina.id,
            message: "Nao consigo acessar mesmo depois de redefinir minha senha.",
            isInternal: false
          },
          {
            senderId: rafa.id,
            message: "Estamos validando bloqueio de sessao e token de reset.",
            isInternal: true
          }
        ]
      }
    }
  });

  await prisma.ticket.create({
    data: {
      ticketNumber: "#2478",
      title: "Integracao de e-mail parou de criar chamados automaticamente",
      description:
        "A caixa de suporte recebeu mensagens, mas nenhum chamado novo entrou na fila.",
      companyId: nova.id,
      requesterId: marina.id,
      assignedToId: amanda.id,
      categoryId: catIntegracoes.id,
      priority: "ALTA",
      status: "EM_ATENDIMENTO",
      messages: {
        create: {
          senderId: amanda.id,
          message: "Identificamos falha na captura IMAP e ja estamos corrigindo.",
          isInternal: false
        }
      }
    }
  });

  await prisma.ticket.create({
    data: {
      ticketNumber: "#2471",
      title: "Atualizacao de permissoes para equipe externa",
      description:
        "Solicitacao para liberar acesso parcial ao modulo de relatorios para terceiros.",
      companyId: orbitInternal.id,
      requesterId: rafa.id,
      assignedToId: joao.id,
      categoryId: catAcesso.id,
      priority: "MEDIA",
      status: "AGUARDANDO_CLIENTE"
    }
  });

  await prisma.ticket.create({
    data: {
      ticketNumber: "#2460",
      title: "Erro intermitente no envio de anexos acima de 10 MB",
      description:
        "Usuarios relataram falha ao anexar arquivos grandes durante o atendimento.",
      companyId: clini.id,
      requesterId: marina.id,
      assignedToId: amanda.id,
      categoryId: catInfra.id,
      priority: "BAIXA",
      status: "RESOLVIDO"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
