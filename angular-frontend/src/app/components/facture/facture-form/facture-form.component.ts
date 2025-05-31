import { Component,  OnInit, Input } from "@angular/core"
import {  FormBuilder, FormGroup, FormArray, Validators,  AbstractControl } from "@angular/forms"
import  { Facture, LigneFacture } from "src/app/models/facture.model"
import  { Dispositif } from "src/app/models/dispositif.model"

@Component({
  selector: "app-facture-form",
  templateUrl: "./facture-form.component.html",
})
export class FactureFormComponent implements OnInit {
  @Input() facture: Facture | null = null
  @Input() dispositifs: Dispositif[] = []
  @Input() clients: any[] = []

  factureForm!: FormGroup
  submitted = false
  loading = false
  isEditMode = false

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm()

    if (this.facture) {
      this.loadFactureData()
    } else {
      this.addLigne() // Add one empty line by default
    }

    this.setupFormSubscriptions()
  }

  private initializeForm(): void {
    this.factureForm = this.formBuilder.group({
      numero: ["", Validators.required],
      dateEmission: ["", Validators.required],
      dateEcheance: ["", Validators.required],
      clientId: ["", Validators.required],
      tauxTVA: [20, [Validators.required, Validators.min(0)]],
      lignes: this.formBuilder.array([]),
      montantHT: [{ value: 0, disabled: true }],
      montantTVA: [{ value: 0, disabled: true }],
      montantTTC: [{ value: 0, disabled: true }],
    })
  }

  private loadFactureData(): void {
    if (!this.facture) return

    this.isEditMode = true
    this.factureForm.patchValue({
      numero: this.facture.numeroFacture,
      dateEmission: this.facture.dateFacture,
      dateEcheance: this.facture.dateEcheance,
      clientId: this.facture.clientId,
      tauxTVA: this.facture.tauxTVA,
    })

    if (this.facture.lignes) {
      this.facture.lignes.forEach((ligne) => this.addLigne(ligne))
    }
  }

  private setupFormSubscriptions(): void {
    const tauxTVAControl = this.factureForm.get("tauxTVA")
    if (tauxTVAControl) {
      tauxTVAControl.valueChanges.subscribe(() => this.calculateTotals())
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.factureForm.controls
  }

  get lignes(): FormArray {
    return this.factureForm.get("lignes") as FormArray
  }

  addLigne(ligne?: LigneFacture): void {
    const ligneForm = this.formBuilder.group({
      dispositifId: [ligne && ligne.dispositifId ? ligne.dispositifId : "", Validators.required],
      nomDispositif: [ligne && ligne.nomDispositif ? ligne.nomDispositif : ""],
      quantite: [ligne && ligne.quantite ? ligne.quantite : 1, [Validators.required, Validators.min(1)]],
      prixUnitaire: [ligne && ligne.prixUnitaire ? ligne.prixUnitaire : 0, [Validators.required, Validators.min(0)]],
      montantLigne: [ligne && ligne.montantLigne ? ligne.montantLigne : 0],
      description: [ligne && ligne.description ? ligne.description : ""],
    })

    this.setupLigneSubscriptions(ligneForm)
    this.lignes.push(ligneForm)
  }

  private setupLigneSubscriptions(ligneForm: FormGroup): void {
    const quantiteControl = ligneForm.get("quantite")
    const prixUnitaireControl = ligneForm.get("prixUnitaire")
    const dispositifIdControl = ligneForm.get("dispositifId")

    if (quantiteControl) {
      quantiteControl.valueChanges.subscribe(() => this.calculateLigneMontant(ligneForm))
    }

    if (prixUnitaireControl) {
      prixUnitaireControl.valueChanges.subscribe(() => this.calculateLigneMontant(ligneForm))
    }

    if (dispositifIdControl) {
      dispositifIdControl.valueChanges.subscribe((id: number) => {
        const dispositif = this.dispositifs.find((d) => d.id === +id)
        if (dispositif) {
          ligneForm.patchValue(
            {
              nomDispositif: dispositif.nom,
              prixUnitaire: dispositif.prix,
            },
            { emitEvent: false },
          )

          this.calculateLigneMontant(ligneForm)
        }
      })
    }
  }

  removeLigne(index: number): void {
    this.lignes.removeAt(index)
    this.calculateTotals()
  }

  calculateLigneMontant(ligneForm: FormGroup): void {
    const quantiteControl = ligneForm.get("quantite")
    const prixUnitaireControl = ligneForm.get("prixUnitaire")

    const quantite = quantiteControl && quantiteControl.value ? Number.parseFloat(quantiteControl.value) : 0
    const prixUnitaire =
      prixUnitaireControl && prixUnitaireControl.value ? Number.parseFloat(prixUnitaireControl.value) : 0
    const montantLigne = quantite * prixUnitaire

    ligneForm.patchValue({ montantLigne }, { emitEvent: false })
    this.calculateTotals()
  }

  calculateTotals(): void {
    const montantHT = this.getMontantHT()
    const montantTVA = this.getMontantTVA(montantHT)
    const montantTTC = montantHT + montantTVA

    this.factureForm.patchValue(
      {
        montantHT,
        montantTVA,
        montantTTC,
      },
      { emitEvent: false },
    )
  }

  getMontantHT(): number {
    return this.lignes.controls.reduce((total, ligne) => {
      const montantLigneControl = ligne.get("montantLigne")
      const value = montantLigneControl && montantLigneControl.value ? Number.parseFloat(montantLigneControl.value) : 0
      return total + value
    }, 0)
  }

  getMontantTVA(montantHT?: number): number {
    const baseAmount = montantHT !== undefined ? montantHT : this.getMontantHT()
    const tauxTVAControl = this.factureForm.get("tauxTVA")
    const tauxTVA = tauxTVAControl ? Number.parseFloat(tauxTVAControl.value) || 0 : 0
    return baseAmount * (tauxTVA / 100)
  }

  getTauxTVA(): number {
    const tauxTVAControl = this.factureForm.get("tauxTVA")
    return tauxTVAControl ? Number.parseFloat(tauxTVAControl.value) || 0 : 0
  }

  getMontantTTC(): number {
    const montantHT = this.getMontantHT()
    const montantTVA = this.getMontantTVA(montantHT)
    return montantHT + montantTVA
  }

  onSubmit(): void {
    this.submitted = true

    if (this.factureForm.valid) {
      this.loading = true
      const rawValue = this.factureForm.getRawValue()
      console.log("Form data:", rawValue)

      // Simulate API call
      setTimeout(() => {
        this.loading = false
        console.log("Form submitted successfully")
      }, 2000)
    } else {
      console.warn("Form is invalid")
      this.markAllFieldsAsTouched()
    }
  }

  onSaveDraft(): void {
    if (this.factureForm.valid) {
      this.loading = true
      const rawValue = this.factureForm.getRawValue()
      console.log("Saving draft:", rawValue)

      // Simulate API call for saving draft
      setTimeout(() => {
        this.loading = false
        console.log("Draft saved successfully")
      }, 1000)
    } else {
      console.warn("Form is invalid, cannot save draft")
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.values(this.factureForm.controls).forEach((control) => {
      control.markAsTouched()

      if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          if (arrayControl instanceof FormGroup) {
            Object.values(arrayControl.controls).forEach((groupControl) => {
              groupControl.markAsTouched()
            })
          }
        })
      }
    })
  }

  onCancel(): void {
    this.factureForm.reset()
    this.clearLignes()
    this.addLigne() // reset to one empty line
    this.submitted = false
    console.log("Form cancelled")
  }

  private clearLignes(): void {
    while (this.lignes.length !== 0) {
      this.lignes.removeAt(0)
    }
  }
}
