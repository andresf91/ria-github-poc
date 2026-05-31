import { test, expect } from '@playwright/test'

const MOCK_TRENDING = {
  total_count: 1,
  items: [{
    id: 1296269,
    name: 'Hello-World',
    full_name: 'octocat/Hello-World',
    html_url: 'https://github.com/octocat/Hello-World',
    description: 'My first repository on GitHub!',
    stargazers_count: 2000,
    forks_count: 400,
    language: 'JavaScript',
    topics: ['github'],
    owner: {
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    },
  }],
}

const MOCK_REPO_DETAIL = {
  id: 1296269,
  name: 'Hello-World',
  full_name: 'octocat/Hello-World',
  html_url: 'https://github.com/octocat/Hello-World',
  description: 'My first repository on GitHub!',
  stargazers_count: 2000,
  forks_count: 400,
  watchers_count: 2000,
  open_issues_count: 5,
  language: 'JavaScript',
  license: { name: 'MIT License' },
  topics: ['github'],
  default_branch: 'main',
  created_at: '2011-01-26T19:01:12Z',
  pushed_at: '2024-01-01T00:00:00Z',
  homepage: null,
  owner: {
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
  },
}

test.beforeEach(async ({ page }) => {
  // Limpia sessionStorage para evitar datos cacheados de trending
  await page.addInitScript(() => sessionStorage.clear())
  await page.route('https://api.github.com/search/repositories*', (route) =>
    route.fulfill({ json: MOCK_TRENDING })
  )
  await page.route('https://api.github.com/repos/octocat/Hello-World*', (route) =>
    route.fulfill({ json: MOCK_REPO_DETAIL })
  )
})

test('navega a trending y accede al detalle de un repositorio', async ({ page }) => {
  await page.goto('/trending')

  await expect(page.getByRole('heading', { name: 'Repositorios Populares' })).toBeVisible()
  await expect(page.locator('strong', { hasText: 'Hello-World' })).toBeVisible()

  await page.locator('a[href="/repo/octocat/Hello-World"]').click()

  await expect(page).toHaveURL('/repo/octocat/Hello-World')
  await expect(page.getByRole('heading', { name: 'Hello-World' })).toBeVisible()
  await expect(page.getByText('My first repository on GitHub!')).toBeVisible()
})

test('el botón de favorito persiste entre recargas', async ({ page }) => {
  await page.goto('/repo/octocat/Hello-World')

  await expect(page.getByRole('heading', { name: 'Hello-World' })).toBeVisible()

  // Inicialmente no es favorito
  await expect(page.locator('button.btn-outline-warning')).toBeVisible()

  // Agrega a favoritos
  await page.locator('button.btn-outline-warning').click()

  // El botón cambia a btn-warning (estrella rellena)
  await expect(page.locator('button.btn-warning')).toBeVisible()

  // Recarga y verifica que el favorito persiste via localStorage
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Hello-World' })).toBeVisible()
  await expect(page.locator('button.btn-warning')).toBeVisible()
})
