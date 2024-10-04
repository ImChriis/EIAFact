import { FormControl, FormGroup, FormArray } from "@angular/forms";

export interface DocumentoElectronicoForm {
  documentoElectronico: FormGroup<{
    encabezado: FormGroup<{
      identificacionDocumento: FormGroup<{
        tipoDocumento: FormControl<string>;
        numeroDocumento: FormControl<string>;
        tipoProveedor: FormControl<string | null>;
        tipoTransaccion: FormControl<string | null>;
        numeroPlanillaImportacion: FormControl<string | null>;
        numeroExpedienteImportacion: FormControl<string | null>;
        serieFacturaAfectada: FormControl<string | null>;
        numeroFacturaAfectada: FormControl<string | null>;
        fechaFacturaAfectada: FormControl<string | null>;
        montoFacturaAfectada: FormControl<string | null>;
        comentarioFacturaAfectada: FormControl<string | null>;
        regimenEspTributacion: FormControl<string | null>;
        fechaEmision: FormControl<string>;
        fechaVencimiento: FormControl<string>;
        horaEmision: FormControl<string>;
        anulado: FormControl<boolean>;
        tipoDePago: FormControl<string>;
        serie: FormControl<string>;
        sucursal: FormControl<string>;
        tipoDeVenta: FormControl<string>;
        moneda: FormControl<string>;
      }>;
      vendedor: FormGroup<{
        codigo: FormControl<string>;
        nombre: FormControl<string>;
        numCajero: FormControl<string>;
      }>;
      comprador: FormGroup<{
        tipoIdentificacion: FormControl<string>;
        numeroIdentificacion: FormControl<string>;
        razonSocial: FormControl<string>;
        direccion: FormControl<string>;
        pais: FormControl<string>;
        telefono: FormArray<FormControl<string>>;
        correo: FormArray<FormControl<string>>;
      }>;
      sujetoRetenido: FormControl<any>;
      totales: FormGroup<{
        nroItems: FormControl<string>;
        montoGravadoTotal: FormControl<string>;
        montoExentoTotal: FormControl<string | null>;
        subtotal: FormControl<string>;
        totalAPagar: FormControl<string>;
        totalIVA: FormControl<string>;
        montoTotalConIVA: FormControl<string>;
        montoEnLetras: FormControl<string>;
        totalDescuento: FormControl<string | null>;
        listaDescBonificacion: FormArray<FormGroup<{
          descDescuento: FormControl<string>;
          montoDescuento: FormControl<string>;
        }>>;
        impuestosSubtotal: FormArray<FormGroup<{
          codigoTotalImp: FormControl<string>;
          alicuotaImp: FormControl<string>;
          baseImponibleImp: FormControl<string>;
          valorTotalImp: FormControl<string>;
        }>>;
        formasPago: FormArray<FormGroup<{
          descripcion: FormControl<string>;
          fecha: FormControl<string>;
          forma: FormControl<string>;
          monto: FormControl<string>;
          moneda: FormControl<string>;
          tipoCambio: FormControl<string | null>;
        }>>;
      }>;
      totalesRetencion: FormControl<any>;
    }>;
    detallesItems: FormArray<FormGroup<{
      numeroLinea: FormControl<string>;
      codigoCIIU: FormControl<string | null>;
      codigoPLU: FormControl<string>;
      indicadorBienoServicio: FormControl<string>;
      descripcion: FormControl<string>;
      cantidad: FormControl<string>;
      unidadMedida: FormControl<string>;
      precioUnitario: FormControl<string>;
      precioUnitarioDescuento: FormControl<string | null>;
      montoBonificacion: FormControl<string | null>;
      descripcionBonificacion: FormControl<string | null>;
      descuentoMonto: FormControl<string | null>;
      precioItem: FormControl<string>;
      codigoImpuesto: FormControl<string>;
      tasaIVA: FormControl<string>;
      valorIVA: FormControl<string>;
      valorTotalItem: FormControl<string>;
      infoAdicionalItem: FormControl<string | null>;
      listaItemOTI: FormArray<FormGroup<{
        tasaOTI: FormControl<string>;
        codigoOTI: FormControl<string>;
        valorOTI: FormControl<string>;
      }>>;
    }>>;
    detallesRetencion: FormControl<any>;
    viajes: FormControl<any>;
    infoAdicional: FormArray<FormGroup<{
      campo: FormControl<string>;
      valor: FormControl<string>;
    }>>;
    guiaDespacho: FormControl<any>;
  }>;
}