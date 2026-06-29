                  <label class="check-item"><input type="checkbox" name="s-pkg" value="Shrink wrap / Stretch film"/>Shrink wrap / Stretch film</label>
                  <label class="check-item"><input type="checkbox" name="s-pkg" value="Pallet / Pallet wrap"/>Pallet / Pallet wrap</label>
                </div>
              </div>
            </div>
            <div class="frow">
              <div class="fl"><label>MOQ</label><input type="text" placeholder="e.g. 5000 pcs"/></div>
              <div class="fl"><label>Lead time</label><input type="text" placeholder="e.g. 14 days"/></div>
            </div>
            <div class="frow">
              <div class="fl"><label>Sample charge</label>
                <select id="s-p-sc" onchange="toggleAmt('s-p-sc','s-p-scamt')">
                  <option value="no">No charge</option><option value="yes">Yes</option>
                </select>
              </div>
              <div class="fl" id="s-p-scamt" style="display:none;"><label>Amount (USD)</label><input type="text" placeholder="e.g. $30"/></div>
            </div>
            <div class="frow full">
              <div class="fl"><label>Nominated by which buyers?</label><input type="text" placeholder="e.g. M&S, ASOS"/></div>
            </div>
          </div>

          <!-- DYEING -->
          <div id="sf-dyeing" class="cat-fields" style="display:none;">
            <div class="frow full">
              <div class="fl"><label>Dyeing processes</label>
                <div class="check-grid">
                  <label class="check-item"><input type="checkbox" name="s-dye" value="Reactive dyeing"/>Reactive dyeing</label>
                  <label class="check-item"><input type="checkbox" name="s-dye" value="Disperse dyeing"/>Disperse dyeing</label>
                  <label class="check-item"><input type="checkbox" name="s-dye" value="Pigment dyeing"/>Pigment dyeing</label>
                  <label class="check-item"><input type="checkbox" name="s-dye" value="Vat dyeing"/>Vat dyeing</label>
                  <label class="check-item"><input type="checkbox" name="s-dye" value="Sulphur dyeing"/>Sulphur dyeing</label>
                  <label class="check-item"><input type="checkbox" name="s-dye" value="Acid dyeing"/>Acid dyeing</label>
                  <label class="check-item"><input type="checkbox" name="s-dye" value="Direct dyeing"/>Direct dyeing</label>
                  <label class="check-item"><input type="checkbox" name="s-dye" value="Discharge printing/dyeing"/>Discharge printing/dyeing</label>
                </div>
              </div>
            </div>
            <div class="frow full">
              <div class="fl"><label>Washing processes</label>
                <div class="check-grid">
