/* FRONTEND TEST CASES
* As seen in RS-7
*/

// Frontend UI Test Case 1.1
describe('Frontend UI Test Case 1.1 - Load User Location', () => {
  it('Displays user location marker when Locate Me is clicked', () => {

    cy.visit('https://lostgrenadiers.org')

    // Mock geolocation
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition')
          .callsFake((cb) => {
            cb({
              coords: {
                latitude: 40.12345,
                longitude: -74.12345
              }
            })
          })
    })

    cy.get('#panelLocateBtn')
        .should('be.visible')
        .click()

    cy.get('.leaflet-marker-icon', { timeout: 10000 })
        .should('exist')
  })
})

// Frontend UI Test Case 1.2
describe('Frontend UI Test Case 1.2 - Search Route', () => {

  beforeEach(() => {
    cy.visit('https://lostgrenadiers.org')
  })

  it('Generates route when valid destination is entered', () => {

    cy.get('#search')
        .should('be.visible')
        .type('LF 119')

    cy.get('#searchBtn')
        .click()

    // Route polyline in Leaflet
    cy.get('.leaflet-interactive', { timeout: 10000 })
        .should('exist')
  })
})


// Frontend UI Test Case 1.3
describe('Frontend UI Test Case 1.3 - Route Search Failure', () => {

  beforeEach(() => {
    cy.visit('https://lostgrenadiers.org')

    // Stub geolocation
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition')
          .callsFake((cb) => {
            cb({ coords: { latitude: 38.34301, longitude: -85.81912 } })
          })
    })

    // Click Locate Me to create userMarker
    cy.get('#panelLocateBtn').click()

    // Wait for user marker
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).should('exist')
  })

  it('Shows alert for invalid room format', () => {
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Enter a room like: LF 119 or KV-110')
    })

    cy.get('#search').clear().type('INVALIDROOM')
    cy.get('#searchBtn').click()
  })
})


// Frontend UI Test Case 1.4
describe('Frontend UI Test Case 1.4 - Indoor Mode Overlay', () => {

  beforeEach(() => {
    cy.visit('https://lostgrenadiers.org')
  })

  it('Loads indoor floor overlay when building clicked in indoor mode', () => {

    cy.get('#indoorToggle').check({ force: true })

    // Click a building marker (e.g., Life Sciences)
    cy.get('.leaflet-marker-icon')
        .first()
        .click({ force: true })

    // Wait for overlay image
    cy.get('img.leaflet-image-layer', { timeout: 10000 })
        .should('exist')
  })
})


// Frontend UI Test Case 1.5
describe('Test Case 1.5 - Clear Route', () => {

  beforeEach(() => {
    cy.visit('https://lostgrenadiers.org')

    // Stub geolocation
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition')
          .callsFake((cb) => {
            cb({ coords: { latitude: 38.34301, longitude: -85.81912 } })
          })
    })

    // Click Locate Me to create userMarker
    cy.get('#panelLocateBtn').click()
    cy.get('.leaflet-marker-icon', { timeout: 10000 }).should('exist')
  })

  it('Clears route from map', () => {
    cy.get('#search').clear().type('LF 119')
    cy.get('#searchBtn').click()

    // Wait for route polyline
    cy.get('path.leaflet-interactive', { timeout: 10000 }).should('exist')

    // Clear route
    cy.get('#clearBtn').click()

    cy.get('path.leaflet-interactive').should('not.exist')
  })
})

// Frontend UI Test Case 1.6
describe('Test Case 1.6 - Accessible Route Toggle', () => {

  beforeEach(() => {
    cy.visit('https://lostgrenadiers.org')
  })

  it('Toggles accessible route option', () => {

    cy.get('#accessibleToggle')
        .check({ force: true })
        .should('be.checked')

    cy.get('#accessibleToggle')
        .uncheck({ force: true })
        .should('not.be.checked')

  })
})
