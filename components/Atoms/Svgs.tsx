// Create the SVG element
export const createNewSvg = (color: 'blue' | 'red') => {
  if (color === 'blue') {
    const Bluesvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    Bluesvg.setAttribute('width', '22');
    Bluesvg.setAttribute('height', '22');
    Bluesvg.setAttribute('viewBox', '0 0 22 22');
    Bluesvg.setAttribute('fill', 'none');
    Bluesvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Create the first rectangle
    const rect1 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    rect1.setAttribute('x', '1');
    rect1.setAttribute('y', '1');
    rect1.setAttribute('width', '20');
    rect1.setAttribute('height', '20');
    rect1.setAttribute('rx', '10');
    rect1.setAttribute('stroke', '#32A8C4');
    rect1.setAttribute('strokeWidth', '2');

    // Create the second rectangle
    const rect2 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    rect2.setAttribute('x', '4');
    rect2.setAttribute('y', '4');
    rect2.setAttribute('width', '14');
    rect2.setAttribute('height', '14');
    rect2.setAttribute('rx', '7');
    rect2.setAttribute('fill', '#32A8C4');

    // Create the third rectangle
    const rect3 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    rect3.setAttribute('x', '4');
    rect3.setAttribute('y', '4');
    rect3.setAttribute('width', '14');
    rect3.setAttribute('height', '14');
    rect3.setAttribute('rx', '7');
    rect3.setAttribute('stroke', '#32A8C4');
    rect3.setAttribute('strokeWidth', '2');

    // Append rectangles to the SVG element
    Bluesvg.appendChild(rect1);
    Bluesvg.appendChild(rect2);
    Bluesvg.appendChild(rect3);

    return Bluesvg;
  } else {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '22');
    svg.setAttribute('height', '22');
    svg.setAttribute('viewBox', '0 0 22 22');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const rect1 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    rect1.setAttribute('x', '1');
    rect1.setAttribute('y', '1');
    rect1.setAttribute('width', '20');
    rect1.setAttribute('height', '20');
    rect1.setAttribute('rx', '10');
    rect1.setAttribute('stroke', '#32A8C4');
    rect1.setAttribute('strokeWidth', '2');

    const rect2 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    rect2.setAttribute('x', '4');
    rect2.setAttribute('y', '4');
    rect2.setAttribute('width', '14');
    rect2.setAttribute('height', '14');
    rect2.setAttribute('rx', '7');
    rect2.setAttribute('fill', '#32A8C4');

    const rect3 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    rect3.setAttribute('x', '4');
    rect3.setAttribute('y', '4');
    rect3.setAttribute('width', '14');
    rect3.setAttribute('height', '14');
    rect3.setAttribute('rx', '7');
    rect3.setAttribute('stroke', '#32A8C4');
    rect3.setAttribute('strokeWidth', '2');

    svg.appendChild(rect1);
    svg.appendChild(rect2);
    svg.appendChild(rect3);

    return svg;
  }
};
