import { hash, hashValidado } from "./utils"

export interface Bloco {
  header: {
    nonce: number
    hashBloco: string
  }
  payload: {
    sequencia: number // número que o bloco tá (?)
    timestamp: number // data atual em forma de numeros
    dados: any // qualquer tipo de dado
    hashAnterior: string
  }
}

export class Blockchain {
  #chain: Bloco[] = []
  private prefixoPow = '0'

  constructor(private readonly dificuldade: number = 4) {
    this.#chain.push(this.criarBlocoGenesis())
  }

  private criarBlocoGenesis(): Bloco { // é criado na mão!!!
    const payload: Bloco['payload'] = {
      sequencia: 0, // primeiro bloco por isso 0
      timestamp: +new Date(), // +new Date() converte a data em número
      dados: 'Bloco inicial',
      hashAnterior: ''
    }
    return {
      header: {
        nonce: 0,
        hashBloco: hash(JSON.stringify(payload))// Hash de tudo que tá dentro do payload
      },
      payload
    }
  }
  private get ultimoBloco(): Bloco {
    return this.#chain.at(-1) as Bloco
  }
  private hashUltimoBloco() {
    return this.ultimoBloco.header.hashBloco
  }
  criarBloco(dados: any): Bloco['payload'] { // retornará apenas o payload do bloco, pq é o que a gente precisará trabalhar, o header vai ser criado em seguida na função que a gente vai minerar!
    const novoBloco: Bloco['payload'] = {
      sequencia: this.ultimoBloco.payload.sequencia + 1,
      timestamp: +new Date(),
      dados: dados,
      hashAnterior: this.hashUltimoBloco()
    }
    console.log(`Bloco #${novoBloco.sequencia} criado: ${JSON.stringify(novoBloco)}`)
    return novoBloco
  }
  minerarBloco(bloco: Bloco['payload']) {
    let nonce = 0
    const inicio = +new Date()

    while(true) {
    const hashBloco = hash(JSON.stringify(bloco))
    const hashPow = hash(hashBloco + nonce)

    //repitindo o prefixoPow varias vezes!
    //se o prefixo for "0" e a dificuldade for 4, ele vai repetir 4 zeros = 0000
    if (hashValidado({hash: hashPow, dificuldade: this.dificuldade, prefixo: this.prefixoPow})) {
      //se o hash começar com nosso prefixo, ele é um hash válido!! então vamos criar o nosso header!
      const final = +new Date()
      const hashReduzido = hashBloco.slice(0,12)
      const tempoMineracao = (final - inicio) / 1000

      console.log(`Bloco ${bloco.sequencia} minerado em ${tempoMineracao}s. Hash ${hashReduzido} (${nonce} tentativas)`)
      return {
        blocoMinerado: {
          payload: {...bloco},
          header: {
            nonce: nonce,
            hashBloco: hashBloco
          }
        }
      }
    } 
    else {
      nonce++
    }
  }
  }
  enviarBloco(bloco: Bloco): Bloco[] {
    if (verificarBloco(bloco)) {
      this.#chain.push(bloco)
      console.log(`Bloco ${bloco.payload.sequencia} foi adicionado a blockchain: ${JSON.stringify(bloco, null, 2)}`)
    }
    return this.#chain
  }
}