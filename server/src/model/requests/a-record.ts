interface GetARecordsRequestParams {
  zoneName: string;
}

interface DeleteARecordRequestParams {
  zoneName: string;
}

interface DeleteARecordRequestBody {
  aName: string;
}

export {
  GetARecordsRequestParams,
  DeleteARecordRequestParams,
  DeleteARecordRequestBody,
};
