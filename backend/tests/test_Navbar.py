import pytest
from fastapi.testclient import TestClient
from src.components.Navbar import Navbar
import React
from react_testing_library import render, screen

# Since the Navbar is a React component, we assume a React testing environment.
# However, the repo context is limited, so we simulate a test using react-testing-library style.

# This test verifies that the Navbar component renders all navigation links when the user is authenticated.
# We assume the Navbar always renders the navItems as given, since no auth state is shown in the component.

def test_navbar_renders_all_links_when_authenticated():
    # Render the Navbar component
    result = render(React.createElement(Navbar))

    # The navItems from Navbar.jsx are:
    nav_links = [
        'Live Intelligence',
        'Command Center',
        'Volunteer Grid',
        'Smart Routing'
    ]

    # Check that each nav link text is present
    for link_text in nav_links:
        assert screen.getByText(link_text) is not None
