# IF-Lanches

## Requisitos Funcionais

| **Código** | **Descrição** |
|-------------|----------------|
| **RF01** | **Tela de Login** |
| RF01.1 | Permitir autenticação por login e senha. |
| RF01.2 | Armazenar e exibir id, nome de usuário e CPF. |
| RF01.3 | Validar credenciais antes de conceder acesso. |
| **RF02** | **CRUD de Produto** |
| RF02.1 | Criar novo produto com id, nome e descrição. |
| RF02.2 | Listar todos os produtos. |
| RF02.3 | Editar produto existente. |
| RF02.4 | Excluir produto. |
| **RF03** | **CRUD de Pedido** |
| RF03.1 | Criar pedido com id, descrição (nome e quantidade dos produtos). |
| RF03.2 | Calcular e registrar valor total da venda. |
| RF03.3 | Registrar data de criação e data de modificação. |
| RF03.4 | Listar e editar pedidos existentes. |
| RF03.5 | Excluir pedidos. |
| **RF04** | **CRUD de Finanças Cliente** |
| RF04.1 | Cadastrar cliente com id, nome, curso, CPF e nome do responsável. |
| RF04.2 | Registrar e atualizar o valor atual do cliente. |
| RF04.3 | Consultar e editar dados financeiros do cliente. |
| RF04.4 | Excluir registros financeiros do cliente. |
| **RF05** | **CRUD de Finanças Entrada** |
| RF05.1 | Registrar entrada financeira com id_finanças, valor de entrada e responsável pelo pagamento. |
| RF05.2 | Armazenar data de criação e modificação. |
| RF05.3 | Permitir edição e exclusão de registros de entrada. |
| **RF06** | **CRUD de Finanças Saída** |
| RF06.1 | Registrar saída financeira com id_finanças e valor de saída. |
| RF06.2 | Armazenar data de criação e modificação. |
| RF06.3 | Permitir edição e exclusão de registros de saída. |

---

## ⚙️ Requisitos Não Funcionais

| **Código** | **Categoria** | **Descrição** |
|-------------|----------------|----------------|
| **RNF01** | Usabilidade | Interface simples, intuitiva e responsiva. Campos de login e formulários com validação e feedback ao usuário. |
| **RNF02** | Segurança | Senhas armazenadas com criptografia. Sessão expira após inatividade. Autenticação obrigatória para acessar qualquer CRUD. |
| **RNF03** | Desempenho | Consultas ao banco em menos de 2 segundos. Atualizações em tempo real nas listas de pedidos e finanças. |
| **RNF04** | Integridade dos Dados | Manter relacionamentos entre tabelas (ex: id_finanças). Validação de CPF e valores numéricos. |
| **RNF05** | Portabilidade | Compatível com navegadores modernos (Chrome, Edge, Firefox). Suporte a dispositivos móveis. |
| **RNF06** | Manutenibilidade | Código modular, organizado por camadas. Comentários e nomenclaturas consistentes. |
