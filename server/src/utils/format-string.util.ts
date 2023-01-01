export const formatString = (str: string): string[] => {
  // удаляем пробелы в начале строки (так как в одной ячейке может быть несколько значений), делаем первую букву большой
  const format = (s: string) => {
    while (s.charAt(0) === ' ') {
      return s.substring(1).charAt(0).toLocaleUpperCase() + s.slice(2)
    }
    return s.charAt(0).toLocaleUpperCase() + s.slice(1)
  }

  return str
    .split(',')
    .map((s: string) => format(s))
    .filter((s: string) => s !== 'null' && s !== 'Null')
}
