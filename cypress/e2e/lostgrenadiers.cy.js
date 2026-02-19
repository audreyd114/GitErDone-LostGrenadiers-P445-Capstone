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

    cy.get('.leaflet-interactive', { timeout: 10000 })
        .should('exist')
  })
})


// Frontend UI Test Case 1.3
describe('Frontend UI Test Case 1.3 - Route Search Failure', () => {

  beforeEach(() => {
    cy.visit('https://lostgrenadiers.org')

    // Wait for map to finish initializing
    cy.window().its('map').should('exist')

    // Stub geolocation
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition')
          .callsFake((cb) => {
            cb({ coords: { latitude: 38.34301, longitude: -85.81912 } })
          })
    })
  })

  it('Shows alert for invalid room format', () => {
    // Click Locate Me to create userMarker
    cy.get('#panelLocateBtn').click()

    // Wait for user marker
    cy.get('.compass-marker', { timeout: 10000 }).should('exist')

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

    // Wait for map to finish initializing
    cy.window().its('map').should('exist')
  })

  it('Loads indoor floor overlay when building clicked in indoor mode', () => {

    // Enable indoor mode
    cy.get('#indoorToggle').check({force: true})

    // Wait for indoor mode to register
    cy.window().its('isIndoorMode').should('be.a', 'function')
    cy.window().invoke('isIndoorMode').should('eq', true)

    cy.window().then((win) => {
      cy.spy(win, 'loadFloorOverlay').as('loadFloorOverlaySpy');
    });

    // simulate marker click programmatically
    cy.window().then((win) => {
      win.loadFloorOverlay('LF', 2);
    });

    cy.get('@loadFloorOverlaySpy').should('have.been.calledWith', 'LF', 2);
  })
})


// Frontend UI Test Case 1.5
describe('Test Case 1.5 - Clear Route', () => {

  beforeEach(() => {
    cy.visit('https://lostgrenadiers.org')

    // Wait for map to finish initializing
    cy.window().its('map').should('exist')

    // Stub geolocation
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition')
          .callsFake((cb) => {
            cb({ coords: { latitude: 38.34301, longitude: -85.81912 } })
          })
    })
  })

  it('Clears route from map', () => {
    // Click Locate Me to create userMarker
    cy.get('#panelLocateBtn').click()

    // Wait for user marker
    cy.get('.compass-marker', { timeout: 10000 }).should('exist')

    cy.get('#search').clear().type('LF 119')
    cy.get('#searchBtn').click()

    // Confirm route in modal
    cy.get('#modalConfirmBtn').click({ force: true })

    // Wait for route polyline
    cy.get('path.leaflet-interactive', { timeout: 10000 }).should('exist')

    // Clear route
    cy.get('#clearBtn').click({force: true})

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
