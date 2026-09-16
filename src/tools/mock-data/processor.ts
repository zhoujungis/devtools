export interface MockUser {
  name: string
  email: string
  phone: string
  avatar: string
  address: string
  company: string
  registeredAt: string
}

const SURNAMES = ['王','李','张','刘','陈','杨','赵','黄','周','吴','徐','孙','胡','朱','高','林','何','郭','马','罗']
const GIVEN = ['伟','芳','娜','敏','静','磊','军','洋','勇','艳','杰','涛','明','超','秀英','霞','平','刚','桂英','文轩','雨欣','子豪','一诺','梓涵']
const CITIES = ['北京市朝阳区','上海市浦东新区','广州市天河区','深圳市南山区','杭州市西湖区','成都市高新区','南京市鼓楼区','武汉市洪山区']
const ROADS = ['中山路','人民路','解放大道','科技路','创新大道','金融街','软件园路']
const COMPANIES = ['星辰科技','云帆网络','极光数据','澎湃信息','远山智能','青藤软件','跃迁互动','琥珀云']
const DOMAINS = ['example.com','test.dev','mail.example.org','demo.io']

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }
function pad(n: number): string { return String(n).padStart(2, '0') }

export function generateUser(): MockUser {
  const name = pick(SURNAMES) + pick(GIVEN)
  const pinyin = `user${randInt(1000, 9999)}`
  return {
    name,
    email: `${pinyin}@${pick(DOMAINS)}`,
    phone: `1${pick(['3','5','7','8','9'])}${Array.from({length:9}, () => randInt(0,9)).join('')}`,
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
    address: `${pick(CITIES)}${pick(ROADS)}${randInt(1, 999)}号`,
    company: pick(COMPANIES),
    registeredAt: `${randInt(2019, 2026)}-${pad(randInt(1,12))}-${pad(randInt(1,28))}`
  }
}

export function generateUsers(count: number): MockUser[] {
  return Array.from({ length: Math.min(Math.max(count, 1), 100) }, generateUser)
}

export function generateCreditCard(): { number: string; luhnValid: true; expiry: string; cvv: string } {
  let digits = '4' // Visa prefix
  while (digits.length < 15) digits += String(randInt(0, 9))
  // Luhn check digit
  let sum = 0
  const full = digits + '0'
  for (let i = 0; i < full.length; i++) {
    let d = Number(full[full.length - 1 - i])
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  const check = (10 - (sum % 10)) % 10
  digits += String(check)
  const now = new Date()
  return {
    number: digits.replace(/(.{4})/g, '$1 ').trim(),
    luhnValid: true,
    expiry: `${pad(randInt(1,12))}/${String(now.getFullYear() + randInt(1, 5)).slice(2)}`,
    cvv: String(randInt(100, 999))
  }
}

export function luhnValid(numberStr: string): boolean {
  const digits = numberStr.replace(/\D/g, '')
  if (digits.length < 12) return false
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  return sum % 10 === 0
}
