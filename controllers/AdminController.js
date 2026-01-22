/**
 * Controller responsável por funcionalidades administrativas do sistema.
 * Gerencia a interface e operações de administração da plataforma.
 */
class AdminController {
    /**
     * Renderiza a página inicial do painel administrativo.
     * 
     * @param {Object} req - Objeto de requisição do Express
     * @param {Object} res - Objeto de resposta do Express
     * @returns {void} Renderiza a página inicial do admin
     */
    index = function (req, res){
        res.render('admin/index')
    }
}

export default new AdminController()