import { test, expect } from '@playwright/test'

const MOCK_USERS = {
  total_count: 1,
  items: [{
    id: 583231,
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    html_url: 'https://github.com/octocat',
    type: 'User',
  }],
}

const MOCK_USER_DETAIL = {
  login: 'octocat',
  id: 583231,
  avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
  html_url: 'https://github.com/octocat',
  name: 'The Octocat',
  bio: 'GitHub mascot',
  public_repos: 8,
  followers: 10000,
  following: 9,
}

const MOCK_USER_REPOS = [{
  id: 1296269,
  name: 'Hello-World',
  full_name: 'octocat/Hello-World',
  html_url: 'https://github.com/octocat/Hello-World',
  description: 'My first repository on GitHub!',
  stargazers_count: 2000,
  forks_count: 400,
  language: 'JavaScript',
  owner: { login: 'octocat' },
}]

const MOCK_USER_ACTIVITY = [{
  id: '1',
  type: 'PushEvent',
  created_at: '2024-01-01T00:00:00Z',
  repo: { name: 'octocat/Hello-World' },
}]

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/search/users*', (route) =>
    route.fulfill({ json: MOCK_USERS })
  )
  // Rutas específicas primero para evitar que el patrón genérico las capture
  await page.route('https://api.github.com/users/octocat/repos*', (route) =>
    route.fulfill({ json: MOCK_USER_REPOS })
  )
  await page.route('https://api.github.com/users/octocat/events/public*', (route) =>
    route.fulfill({ json: MOCK_USER_ACTIVITY })
  )
  await page.route('https://api.github.com/users/octocat', (route) =>
    route.fulfill({ json: MOCK_USER_DETAIL })
  )
})

test('busca un usuario y navega a su perfil', async ({ page }) => {
  await page.goto('/')

  await page.fill('input[placeholder*="usuario de GitHub"]', 'octocat')
  await page.click('button[type="submit"]')

  await expect(page.locator('h5.card-title', { hasText: 'octocat' })).toBeVisible()

  await page.locator('a[href="/user/octocat"]').click()

  await expect(page).toHaveURL('/user/octocat')
  await expect(page.getByRole('heading', { name: 'The Octocat' })).toBeVisible()
  await expect(page.getByText('@octocat')).toBeVisible()
  await expect(page.getByText('Repositorios Destacados')).toBeVisible()
})
