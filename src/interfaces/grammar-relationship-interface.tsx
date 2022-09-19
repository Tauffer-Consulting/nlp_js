interface IHead {
    ind: string | number
    relationship: string
    relationshipTag: string
  }
  
export interface IGrammarRelationshipData {
  [key: string | number]: {
    text: string,
    pos: string,
    head: IHead[]
    posTag: string
    children: any[]
  }
}