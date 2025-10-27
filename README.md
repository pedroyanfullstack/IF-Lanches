# IF-Lanches

## 🧩 Requisitos Funcionais

| **Código** | **Descrição** |
|-------------|----------------|
| **01** | **Tela de Login** |
| 01.1 | Permitir autenticação por login e senha. |
| 01.2 | Armazenar e exibir id, nome de usuário e CPF. |
| 01.3 | Validar credenciais antes de conceder acesso. |
| **02** | **CRUD de Produto** |
| 02.1 | Criar novo produto com id, nome e descrição. |
| 02.2 | Listar todos os produtos. |
| 02.3 | Editar produto existente. |
| 02.4 | Excluir produto. |
| **03** | **CRUD de Pedido** |
| 03.1 | Criar pedido com id, descrição (nome e quantidade dos produtos). |
| 03.2 | Calcular e registrar valor total da venda. |
| 03.3 | Registrar data de criação e data de modificação. |
| 03.4 | Listar e editar pedidos existentes. |
| 03.5 | Excluir pedidos. |
| **04** | **CRUD de Finanças Cliente** |
| 04.1 | Cadastrar cliente com id, nome, curso, CPF e nome do responsável. |
| 04.2 | Registrar e atualizar o valor atual do cliente. |
| 04.3 | Consultar e editar dados financeiros do cliente. |
| 04.4 | Excluir registros financeiros do cliente. |
| **05** | **CRUD de Finanças Entrada** |
| 05.1 | Registrar entrada financeira com id_finanças, valor de entrada e responsável pelo pagamento. |
| 05.2 | Armazenar data de criação e modificação. |
| 05.3 | Permitir edição e exclusão de registros de entrada. |
| **06** | **CRUD de Finanças Saída** |
| 06.1 | Registrar saída financeira com id_finanças e valor de saída. |
| 06.2 | Armazenar data de criação e modificação. |
| 06.3 | Permitir edição e exclusão de registros de saída. |

---

## ⚙️ Requisitos Não Funcionais

| **Código** | **Categoria** | **Descrição** |
|-------------|----------------|----------------|
| **01** | Usabilidade | Inteace simples, intuitiva e responsiva. Campos de login e formulários com validação e feedback ao usuário. |
| **02** | Segurança | Senhas armazenadas com criptografia. Sessão expira após inatividade. Autenticação obrigatória para acessar qualquer CRUD. |
| **03** | Desempenho | Consultas ao banco em menos de 2 segundos. Atualizações em tempo real nas listas de pedidos e finanças. |
| **04** | Integridade dos Dados | Manter relacionamentos entre tabelas (ex: id_finanças). Validação de CPF e valores numéricos. |
| **05** | Portabilidade | Compatível com navegadores modernos (Chrome, Edge, Firefox). Suporte a dispositivos móveis. |
| **06** | Manutenibilidade | Código modular, organizado por camadas. Comentários e nomenclaturas consistentes. |
