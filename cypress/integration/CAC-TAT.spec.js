/// <reference types="Cypress" />
//site local, fora da internet >
//http://localhost:51673/__/#/tests/integration/CAC-TAT.spec.js

describe('Central de Atendimento ao Cliente TAT', function() {
    this.beforeEach(function() {                                  //usado para repetir o processo (entrar no site) e reaproveitar o código.
        cy.visit('./src/index.html')
    })
    it('Verifica o título da aplicação', function() {

        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT' )
    })

    it('Preencher os campos obrigatórios e enia o formulário', function (){

        const longText = 'Isso é um TESTE! Isso é um TESTE! Isso é um TESTE!' //***

        cy.get('#firstName').type('Jorge')
        cy.get('#lastName').type('Choairy')
        cy.get('#email').type('choairy@gmail.com')
        
        //***
        // cy.get('#open-text-area').type('Isso é um TESTE! Isso é um TESTE! Isso é um TESTE!')
        // ou >>>>
        cy.get('#open-text-area').type(longText, {delay: 0})    //delay 0 corta o tempo de processamento de digitação!
        //***

        cy.get('button[type="submit"]').click()
        
        cy.get('.success').should('be.visible')
    })

    it('Exibir mensagem de erro ao submeter o formulário com um email com formatação inválida', function() { // eu posso colocar ".only" (ex: it.only('xx...')) assim depois do beforeEach ele já pula para esse teste em vez de passar pelos testes anteriores!

        cy.get('#firstName').type('Jorge')
        cy.get('#lastName').type('Choairy')

        cy.get('#email').type('choairy@gmail,com') //xxxxx,com
        
        cy.get('#open-text-area').type('Teste')

        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible') //.error

    })

    it('Campo de telefone continua vazio quando preenchido com valor não-numérico', function (){

        cy.get('#phone').type('abcdefghij').should('have.value', '') // '' valor vazio (se só aceita números, mesmo digitando abcde...)
        
    })

    it('Exibir mensagem de erro quando o telefone se torna obrigatório mas não é preenchido', function (){

        cy.get('#firstName').type('Jorge')
        cy.get('#lastName').type('Choairy')
        cy.get('#email').type('choairy@gmail.com')

        cy.get('#phone-checkbox').check() //Marcar o checkbox de telefone mas não digitar o telefone
        
        cy.get('#open-text-area').type('Teste')

        cy.get('button[type="submit"]').click()
        
        cy.get('.error').should('be.visible') //Ver mensagem de erro
        
    })

    it('Preenche e limpa os campos nome, sobrenome, email e telefone', function (){

        cy.get('#firstName').type('Jorge').should('have.value', 'Jorge').clear().should('have.value','')
        cy.get('#lastName').type('Choairy').should('have.value', 'Choairy').clear().should('have.value','')
        cy.get('#email').type('choairy@gmail.com').should('have.value', 'choairy@gmail.com').clear().should('have.value','')
        cy.get('#phone').type('123456789').should('have.value', '123456789').clear().should('have.value','')
        cy.get('#open-text-area').type('Teste').should('have.value', 'Teste').clear().should('have.value','')

    })

    it('Exibir mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function (){

        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')

    })   

    it('Envia o formulário com sucesso usando um comando CUSTOMIZADO', function (){
        //Primeiro coloque "import './commands'" na área do "index.js"
        //Segundo em "cypress<support" crie o comando "Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() { xxxx })"
        //Terceiro adicione o nome do comando customizado a área de testes (no caso "cy.fillMandatoryFieldsAndSubmit()")
        
        cy.fillMandatoryFieldsAndSubmit() //Esse comando customizado faz oque o primeiro teste pede (enviar o formulário corretamente)
        
        cy.get('.success').should('be.visible')
    })        

    it('Trocar o elemento "cy.get()" por "cy.contains()" marcando o seletor CSS e como segundo argumento o seu texto contido', function (){
        //cy.contains('button', 'Enviar').click()

        cy.get('#firstName').type('Jorge')
        cy.get('#lastName').type('Choairy')
        cy.get('#email').type('choairy@gmail.com')
        cy.get('#open-text-area').type('Teste')
    
        // cy.get('button[type="submit"]').click()
        // Nesse caso troco o get por contains e coloco os 2 valores do elemento:
        cy.contains('button', 'Enviar').click()
        
        cy.get('.success').should('be.visible')
    })

    it('Selecione um produto (YouTube) por seu texto', function (){

        cy.get('#product').select('YouTube').should('have.value', 'youtube') // no .should coloco o valor (value) e não o texto!

    })

    it('Selecione um produto (Mentoria) por seu valor (value)', function (){

        cy.get('#product').select('mentoria').should('have.value', 'mentoria')

    })

    it('Selecione um produto (Blog) por seu índice', function (){

        cy.get('#product').select(1).should('have.value', 'blog') // .select(1) pois começa na posição 0 (sendo o 0 Selecione, 1 o Blog, 2 Cursos...)

    })

    it('Marque o tipo de atendimento "Feedback" por meio de Radio', function (){
        
        // O seletor do cypress da: "cy.get(':nth-child(4) > input')" para o Feedback.
        
        cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback') 
        
        // Buscando um seletor melhor (inspecionar) encontramos o Type e o Value
        // O ".check()" é para marcar o campo
        
    })

    it('Marque cada tipo de atendimento, por meio de Radio', function (){
        
        cy.get('input[type="radio"]')   //vai pegar todos os radio buttons
            .should('have.length', 3)   //verifica que tem "3" elementos
            .each(function($radio) {    //pega cada um dos elementos
                cy.wrap($radio).check()                 //"empacota cada um dos radio" e marca cada um                 
                cy.wrap($radio).should('be.checked')    //verifica se cada um foi marcado
            })
    })

    it('Marcar todos os checkboxes, depois desmarca apenas o ultimo', function (){
        
        cy.get('input[type="checkbox"]').check() //marcou todos os checkbox
            .should('be.checked')     //verifica se todos foram marcados
            .last().uncheck()   //desmarcou o ultimo
            .should('not.be.checked') //verifica se foi desmarcado
    })
//Seção 7
    it('"Adicione um Anexo" - Selecionar um arquivo da pasta fixtures', function() {

        cy.get('input[type="file"]#file-upload')    //selecionando a caixa "Escolher Arquivo"
            .should('not.have.value')   //verificando que não tem nenhum arquivo

            .selectFile('./cypress/fixtures/example.json')  //escolher arquivo
            .should(function($input) {
                console.log($input) //(Esse console só serve para mostrar no terminal o seu local) inspecionar para ver os valores a seguir:
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('"Adicione um Anexo" - Selecionar um arquivo simulando um "drag-and-drop"', function() { //drag-and-drop simula como se você estivesse "arrastando" um arquivo

        cy.get('input[type="file"]#file-upload')    //selecionando a caixa "Escolher Arquivo"
            .should('not.have.value')   //verificando que não tem nenhum arquivo

            .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})  //escolher arquivo e adicionar a propriedade "action" ('drag-drop')
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('"Adicione um Anexo" - Selecionar um arquivo utilizando uma fixture para a qual foi dada um alias', function() { //drag-and-drop simula como se você estivesse "arrastando" um arquivo

        cy.fixture('example.json').as('sampleFile')
        
        cy.get('input[type="file')
            .selectFile('@sampleFile') // @ identifica que é um "alias"
            
            .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
            })
    })
//Seção 8
    it('"Links e Abas" - Verificar que a política de privacidade abre uma outra aba sem a necessidade de clicar e abrir ela', function() { 
        cy.get('#privacy a').should('have.attr','target','_blank') // "a" ("ancora"), com o 'have.attr' posso colocar os valores dos atributos por texto, should com os atributos "target,_blank"(inspecionar o lemento)

    })

    it('"Links e Abas" - Acessar a  página de política de privacidade removendo o "Target" e então clicando no link', function() { 
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //o "invoke" ("invoca") podendo trazer o elemento 'removeAttr'
            .click()
        
        cy.contains('Talking About Testing').should('be.visible') //como na tradução já diz "contains" é contém e nesse caso foi colocado para pegar o elemento com o texto

    })

//Seção 9
//1 //Crie um script no arquivo "package.json" que abre o Cypress Runner 
    //simulando um dispositovo com 410 pixels de largura e 860 pixels de altura:

    //comando --> "cy:opne:mobile": "cypress open --config viewportWidth=410 viiewportHeight=860", (basta clicar no player em NPM SCRIPTS>test) Ele vai rodar no terminal mas na pasta de vídeos fica normal
    //*agora você está simulando em "uma resolução mobile"

    //Execute os testes e veja-os passando, simulando a execução em um "viewport mobile"

//2 //Crie um script no arquivo "package.json" que rode os testes em modo headless,
    //simulando um dispositovo com 410 pixels de largura e 860 pixels de altura:

    //comando --> "test:mobile": "cypress open --config viewportWidth=410 viiewportHeight=860"  (basta clicar no player em NPM SCRIPTS>test:mobile) Ele vai rodar normal no cypress
    //*agora você está simulando em "uma resolução mobile" no modo "Headless"

    //Execute os testes e veja-os passando, simulando a execução em um "viewport mobile", agora em modo headless

  

//Seção 10
    //Documentação de projetos
        //Localizado no arquivo README.md


        
//Seção 11


  })
