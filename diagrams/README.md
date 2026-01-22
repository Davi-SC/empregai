# Diagramas de Engenharia - Sistema Empregai

Este diretório contém os diagramas de engenharia do sistema Empregai, criados em PlantUML baseados na análise do código-fonte.

## 📊 Diagramas Disponíveis

### 1. [`state-candidacy.puml`](file:///c:/Users/cruzd/OneDrive/Área%20de%20Trabalho/ADS/2025.2/EngSoftware2/empregai/diagrams/state-candidacy.puml) - Diagrama de Estados da Candidatura

**Descrição:** Modela o ciclo de vida completo de uma candidatura (relacionamento entre candidato e vaga).

**Estados Principais:**
- **Candidatura Cadastrada** - Candidato se candidatou à vaga
- **Em Análise** - Empresa está avaliando a candidatura
- **Aprovada** - Candidato foi aprovado pela empresa
- **Negada** - Candidato não foi aprovado
- **Cancelada** - Candidato cancelou sua própria candidatura

**Transições Principais:**
- Cadastro → Candidato clica em "Candidatar-se"
- Análise → Empresa avalia perfil e requisitos
- Aprovação/Negação → Decisão da empresa
- Cancelamento → Candidato desiste da candidatura
- Deleção em cascata quando vaga ou candidato são removidos

### 2. [`state-vacant.puml`](file:///c:/Users/cruzd/OneDrive/Área%20de%20Trabalho/ADS/2025.2/EngSoftware2/empregai/diagrams/state-vacant.puml) - Diagrama de Estados da Vaga

**Descrição:** Modela o ciclo de vida completo de uma vaga de emprego.

**Estados Principais:**
- **Vaga Criada** - Nova vaga publicada pela empresa
- **Vaga Publicada** - Visível no feed de candidatos
- **Vaga Visualizada** - Detalhes sendo exibidos para candidatos
- **Vaga com Candidaturas** - Possui uma ou mais candidaturas
- **Vaga em Edição** - Sendo atualizada pela empresa

**Transições Principais:**
- Criação → Publicação no sistema
- Visualização → Candidatos veem detalhes
- Candidaturas → Relacionamento N:N com candidatos
- Edição → Atualização de informações
- Deleção em cascata remove candidaturas associadas

### 3. [`case-diagram.puml`](file:///c:/Users/cruzd/OneDrive/Área%20de%20Trabalho/ADS/2025.2/EngSoftware2/empregai/diagrams/case-diagram.puml) - Diagrama de Casos de Uso

**Descrição:** Modela todos os casos de uso do sistema organizados por ator e funcionalidade.

**Atores:**
- **Visitante** - Usuário não autenticado
- **Candidato** - Usuário do tipo candidato (estende Visitante)
- **Empresa** - Usuário do tipo empresa (estende Visitante)

**Pacotes de Casos de Uso:**

#### Autenticação (comum a todos)
- Realizar Login
- Realizar Logout  
- Cadastrar-se no Sistema

#### Gestão de Perfil - Candidato
- Criar Perfil de Candidato
- Editar Perfil de Candidato
- Visualizar Perfil de Candidato

#### Busca e Candidaturas
- Visualizar Feed de Vagas
- Filtrar Vagas por Critérios (include)
- Visualizar Detalhes da Vaga
- Candidatar-se a Vaga
- Visualizar Minhas Candidaturas

#### Gestão de Perfil - Empresa
- Criar Perfil de Empresa
- Editar Perfil de Empresa
- Visualizar Perfil de Empresa

#### Gestão de Vagas
- Criar Vaga de Emprego
- Editar Vaga de Emprego
- Listar Todas as Vagas

#### Busca de Candidatos
- Visualizar Feed de Candidatos
- Filtrar Candidatos por Critérios (include)
- Visualizar Perfil de Candidato

#### Informações Gerais
- Acessar Página Inicial
- Acessar Página de Dúvidas

**Relacionamentos Especiais:**
- `<<include>>` - Feed de vagas/candidatos sempre incluem filtros
- `<<extends>>` - Perfis são criados automaticamente após cadastro
- Herança entre Candidato/Empresa e Visitante

## 🔧 Como Visualizar

### Opção 1: Plugin VS Code
1. Instale a extensão **PlantUML** no VS Code
2. Abra qualquer arquivo `.puml`
3. Use `Alt+D` para preview

### Opção 2: Online
1. Acesse [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. Cole o conteúdo do arquivo `.puml`
3. Visualize o diagrama gerado

### Opção 3: CLI
```bash
# Instalar PlantUML via npm
npm install -g node-plantuml

# Gerar PNG
puml generate state-candidacy.puml -o output/

# Gerar SVG
puml generate state-candidacy.puml -o output/ -f svg
```

## 📝 Notas Importantes

### Baseado em Código Real
Todos os diagramas foram criados através de **engenharia reversa** do código-fonte documentado, refletindo:
- Estados reais identificados nas controllers
- Transições baseadas nas rotas e métodos
- Relacionamentos do banco de dados (models)
- Middlewares de autenticação (regras.js)

### Sincronização
Os diagramas estão sincronizados com:
- **Models:** Relacionamentos (belongsTo, CASCADE)
- **Controllers:** Operações (criar, editar, listar)
- **Routes:** Endpoints e proteções
- **Config:** Autenticação Passport.js

### Manutenção
Se o código for modificado, os diagramas devem ser atualizados para refletir:
- Novos estados ou transições
- Novos casos de uso
- Mudanças nos relacionamentos
- Alterações nos middlewares de autorização

## 🎯 Aplicações

Estes diagramas podem ser usados para:
- **Documentação técnica** do sistema
- **Onboarding** de novos desenvolvedores
- **Apresentações** para stakeholders
- **Análise de requisitos** e funcionalidades
- **Planejamento** de novas features
- **Engenharia reversa** e compreensão do legado
