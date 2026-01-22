/**
 * @fileoverview Script de inicialização e sincronização do banco de dados.
 * Cria todas as tabelas do sistema na ordem correta respeitando as dependências
 * entre modelos (chaves estrangeiras).
 */

import Usuario from "./Usuario.js";
import Candidato from "./Candidato.js";
import Empresa from "./Empresa.js";
import Vaga from "./Vaga.js";
import Candidatura from "./Candidatura.js";


/**
 * Sequência de sincronização das tabelas no banco de dados.
 * 
 * ORDEM IMPORTANTE:
 * 1. Usuario - Tabela raiz sem dependências
 * 2. Candidato - Depende de Usuario (usuario_id)
 * 3. Empresa - Depende de Usuario (usuario_id)
 * 4. Vaga - Depende de Empresa (empresa_id)
 * 5. Candidatura - Depende de Candidato e Vaga (candidato_id, vaga_id)
 * 
 * A ordem garante que as chaves estrangeiras sejam criadas corretamente.
 * Cada sync() cria a tabela se não existir ou a atualiza se necessário.
 */
Usuario.sync()
    .then(() => Candidato.sync())
    .then(() => Empresa.sync())
    .then(() => Vaga.sync())
    .then(() => Candidatura.sync());