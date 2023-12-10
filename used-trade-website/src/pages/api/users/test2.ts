//피카츄 API

import { NextApiRequest, NextApiResponse } from 'next'
import puppeteer, { Page, ElementHandle } from 'puppeteer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.goto('https://m.bunjang.co.kr/search/products?q=메이플')

  const productElements = await page.$x(
    '//*[@id="root"]/div/div/div[4]/div/div[4]/div/div',
  )
  const results = []

  for (const productElement of productElements) {
    const imageElement = await productElement.$x('./a/div[1]/img')
    const nameElement = await productElement.$x('./a/div[2]/div[1]')
    const priceElement = await productElement.$x('./a/div[2]/div[2]/div[1]')
    const linkElement = await productElement.$x('./a')

    const productImage = await page.evaluate(
      (element: HTMLImageElement) => element.src,
      imageElement[0] as ElementHandle<HTMLImageElement>,
    )
    const productName = await page.evaluate(
      (element: HTMLElement) => element.textContent,
      nameElement[0] as ElementHandle<HTMLElement>,
    )
    const productPrice = await page.evaluate(
      (element: HTMLElement) => element.textContent,
      priceElement[0] as ElementHandle<HTMLElement>,
    )
    const productLink = await page.evaluate(
      (element: HTMLAnchorElement) => element.href,
      linkElement[0] as ElementHandle<HTMLAnchorElement>,
    )

    results.push({ productImage, productName, productPrice, productLink })
  }

  await browser.close()

  res.status(200).json(results)
}
