import Usuario from "./Usuario.js";
import Candidato from "./Candidato.js";
import Empresa from "./Empresa.js";
import Vaga from "./Vaga.js";
import Candidatura from "./Candidatura.js";


// sequencia correta para criar cada tabela
Usuario.sync()
    .then(() => Candidato.sync())
    .then(() => Empresa.sync())
    .then(() => Vaga.sync())
    .then(() => Candidatura.sync());