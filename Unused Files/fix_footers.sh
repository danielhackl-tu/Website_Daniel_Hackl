#!/bin/bash

# English service pages
for file in service-*.html; do
    if [ "$file" != "service-safety.html" ] && [ "$file" != "service-analysis.html" ]; then
        # Replace complex footer with simple one for English pages
        sed -i '' '
        /<!-- Footer with Legal Links -->/,/  <\/footer>/ {
            /<!-- Footer with Legal Links -->/r /dev/stdin
            d
        }
        ' "$file" << 'EOF'
  <!-- Footer with Legal Links -->
  <footer id="footer" class="footer position-relative light-background">
    <div class="container">
      <div class="copyright text-center">
        <p>© <span>Copyright</span> <strong class="px-1 sitename">Daniel Hackl</strong> <span>All Rights Reserved</span></p>
      </div>
      <div class="legal-links text-center mt-2">
        <a href="impressum.html">Impressum</a>
        <span class="mx-2">|</span>
        <a href="datenschutz.html">Datenschutzerklärung</a>
      </div>
      <div class="social-links d-flex justify-content-center">
        <a href="https://github.com/danielhackl-tu" target="_blank"><i class="bi bi-github"></i></a>
        <a href="https://www.linkedin.com/in/daniel-hackl-vienna" target="_blank"><i class="bi bi-linkedin"></i></a>
      </div>
    </div>
  </footer>
EOF
    fi
done

# German service pages
for file in de/service-*.html; do
    # Replace complex footer with simple one for German pages
    sed -i '' '
    /<!-- Footer with Legal Links -->/,/  <\/footer>/ {
        /<!-- Footer with Legal Links -->/r /dev/stdin
        d
    }
    ' "$file" << 'EOF'
  <!-- Footer with Legal Links -->
  <footer id="footer" class="footer position-relative light-background">
    <div class="container">
      <div class="copyright text-center">
        <p>© <span>Copyright</span> <strong class="px-1 sitename">Daniel Hackl</strong> <span>Alle Rechte vorbehalten</span></p>
      </div>
      <div class="credits">
        <p>Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a></p>
        
        <!-- Legal Links -->
        <p class="legal-links">
          <a href="../impressum.html">Impressum</a> | 
          <a href="../datenschutz.html">Datenschutzerklärung</a>
        </p>
      </div>
    </div>
  </footer>
EOF
done
