import { diffLines, diffChars, Change } from 'diff'

export function getLineDiff(a:string, b:string): Change[] { return diffLines(a,b) }
export function getCharDiff(a:string, b:string): Change[] { return diffChars(a,b) }
