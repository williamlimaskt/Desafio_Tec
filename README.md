# Desafio de Integrações

Este projeto realiza a integração com a API **[RandomUser.me](https://randomuser.me/)** para buscar informações sobre usuários e armazená-los em um banco de dados SQLite. O projeto inclui a validação de idade para garantir que apenas usuários maiores de 18 anos sejam armazenados no banco de dados.

## Estrutura do Projeto

desafio-integracoes/
│
├── src/
│ ├── db.js # Conexão e manipulação do banco de dados SQLite
│ ├── index.js # Lógica principal de integração e processamento dos dados
│ └── report.js # Função para gerar o relatório do processamento
├── data/
│ └── users.sqlite # Banco de dados SQLite (será gerado automaticamente)
├── package.json # Arquivo de configuração do projeto (dependências, scripts)
└── README.md # Documentação do projeto

## Dependências

- **axios**: Para fazer requisições HTTP para a API.
- **sqlite3**: Para manipulação do banco de dados SQLite.

### Instalação

1. Clone o repositório:

   git clone https://github.com/williamlimaskt/Desafio_Tec

2. Acesse o diretório do projeto:

   cd desafio-integracoes

3. Instale as dependências:

   npm install

### Executando o Projeto

Para rodar o projeto, execute o comando:

npm start

Isso irá:

1. Buscar 150 usuários da API **RandomUser.me**.
2. Validar a idade de cada usuário e ignorar os menores de 18 anos.
3. Armazenar os dados dos usuários maiores de 18 anos no banco de dados SQLite (`data/users.sqlite`).
4. Gerar um relatório do processamento e salvá-lo como um arquivo JSON em `reports`.

### Relatório

Após a execução, o relatório será exibido no console e salvo em um arquivo JSON no diretório `reports`. O relatório inclui informações sobre:

- **Total de usuários processados**.
- **Total de usuários adicionados ao banco de dados**.
- **Total de usuários atualizados**.
- **Total de usuários ignorados por serem menores de idade**.
- **Erros encontrados durante o processamento**.

Exemplo de saída no console:

=== Relatório de Processamento ===
┌─────────────────┬────────┐
│ (index) │ Values │
├─────────────────┼────────┤
│ totalFetched │ 150 │
│ processed │ 145 │
│ added │ 140 │
│ updated │ 5 │
│ ignoredUnderage │ 5 │
│ errors │ 0 │
└─────────────────┴────────┘

### Banco de Dados

O banco de dados SQLite será criado automaticamente no diretório `data/` com o nome `users.sqlite`. A tabela `users` terá os seguintes campos:

- **email**: Email do usuário (chave primária).
- **first_name**: Primeiro nome do usuário.
- **last_name**: Sobrenome do usuário.
- **dob_date**: Data de nascimento do usuário.
- **age**: Idade do usuário.
- **phone**: Número de telefone do usuário.
- **country**: País do usuário.
- **state**: Estado do usuário.
- **city**: Cidade do usuário.
- **postcode**: Código postal do usuário.
- **updated_at**: Data da última atualização do usuário.
- **created_at**: Data de criação do registro do usuário.

### Como Funciona

1. **API RandomUser.me**: O projeto faz uma requisição à API **RandomUser.me** para buscar informações de 150 usuários aleatórios. A API retorna dados como nome, email, data de nascimento, telefone e localidade do usuário.

2. **Validação de Idade**: O código verifica a idade de cada usuário. Apenas os usuários com 18 anos ou mais são processados e armazenados no banco de dados. Usuários menores de 18 anos são ignorados.

3. **Armazenamento no SQLite**: O banco de dados SQLite é usado para armazenar os dados dos usuários. O banco é criado automaticamente se não existir e a tabela `users` é criada com os dados dos usuários maiores de 18 anos.

4. **Relatório**: O relatório é gerado após a execução do processo, exibindo estatísticas como o número de usuários processados, adicionados, atualizados e ignorados por idade.
